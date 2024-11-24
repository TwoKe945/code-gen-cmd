import { defineCommand } from '../types'
import inquirer from 'inquirer'
import { globSync } from 'glob'
import { TEMPLATE_FOLDER_PATH, getConfig } from '@code-gen-bin/shared'
import fsExtra from 'fs-extra'
import chalk from 'chalk'
import { renderFile, render } from 'ejs'
import global from './global'
import { resolve } from 'path'
import { cwd } from 'process'

const { existsSync, mkdirpSync, writeFileSync, readFileSync } = fsExtra

interface CustomTemplatePrompt {
  type: 'input' ,
  name: string,
  message: string,
  defaultValue?: any
  includes?: string[]
}

interface CustomTemplateConfig {
  filename: string
  outDir: string
  templateParams?: Record<string, any> | Record<string, any>[]
  prompts: CustomTemplatePrompt[],
  
}

async function generateTemplate(templateName: string, isCheck: boolean) {
  const templateFilePath = `${TEMPLATE_FOLDER_PATH}/${templateName}`;
  if (isCheck && !existsSync(templateFilePath)) {
    console.log(chalk.red(`${templateName} 模板不存在`))
    return
  }
  const configName = templateName.replace(".ejs", ".json")
  if (!existsSync(`${TEMPLATE_FOLDER_PATH}/${configName}`)) {
    console.log(chalk.red(`${configName} 配置不存在`))
    return
  }
  const config = getConfig()
  const configContent = JSON.parse(readFileSync(`${TEMPLATE_FOLDER_PATH}/${configName}`, { encoding: 'utf-8' })) as CustomTemplateConfig
  const params = {
    ...global,
    package: config.package,
    packagePath: config.package.replaceAll('.', '/'),
  };
  if (Array.isArray(configContent.templateParams)) {
    configContent.templateParams.forEach(async _params => {
      const _templateParams = Object.assign({...params}, _params)
      const content = await renderFile(templateFilePath, _templateParams) as any
      const filename = await render(configContent.filename, _templateParams)
      const outDir = await render(configContent.outDir, _templateParams)
      const outputFolder = resolve(cwd(), outDir)
      if (!existsSync(outputFolder)) {
        mkdirpSync(outputFolder)
      }
      writeFileSync(resolve(outputFolder, filename), content, { encoding: 'utf-8' })
    })
    return
  }

  if (configContent.templateParams) {
    Object.keys(configContent.templateParams).forEach(key => {
      params[key] = (configContent.templateParams as any)[key]
    })
  } else if (configContent.prompts) {
    for(let item of configContent.prompts) {
      const answer = await inquirer.prompt({
        type: item.type,
        name: item.name,
        message: item.message,
        default: item.defaultValue,
        validate: (value) => {
          if (item.includes && !item.includes.includes(value)) {
            return "请输入合法的值：" + item.includes.join('、')
          }
          return true
        }
      })
      params[item.name] = answer[item.name]
    }
  }

  const content = await renderFile(templateFilePath, params)
  const filename = await render(configContent.filename, params)
  const outDir = await render(configContent.outDir, params)
  const outputFolder = resolve(cwd(), outDir)
  if (!existsSync(outputFolder)) {
    mkdirpSync(outputFolder)
  }
  writeFileSync(resolve(outputFolder, filename), content, { encoding: 'utf-8' })
}

export default defineCommand({
  description: '使用自定义模板生成模板',
  flags: '-gct, --generate-custom-template [template]',
  async execute(ctx) {
    if (ctx.generateCustomTemplate) {
      if (typeof ctx.generateCustomTemplate === 'string') { // 自选模板
        generateTemplate(ctx.generateCustomTemplate, true)
      } else { // 选择模板
        const templateFolder = TEMPLATE_FOLDER_PATH
        if (!existsSync(templateFolder)) {
          mkdirpSync(templateFolder)
        }
        const templateFilePaths =  globSync(`${templateFolder}/*.ejs`)
        if (templateFilePaths.length == 0) {
          console.log(chalk.red(`${templateFolder} 目录下没有可选的ejs模板文件`))
          return
        }
        const templates = templateFilePaths.map(path => path.substring(path.lastIndexOf("\\") + 1))
        inquirer.prompt({
          type: 'list',
          name: 'template',
          message: '请选择模板',
          choices: templates
        }).then(async answer => {
          generateTemplate(answer.template, false)
        })
      }
    }
  }
})
