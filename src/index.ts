#! /usr/bin/env node
import { program } from 'commander'
import { cwd } from 'process';
import inquirer from 'inquirer'
import chalk from 'chalk';
import {  exitsConfig, getConfig, getConfigPath, writeConfig } from './utils'
import {  DEFAULT_CONFIG, CONFIG_NAME, GEN_FOLDER_PATH, TABLE_JSON, GEN_FOLDER_NAME } from './constants'
import fsExtra from 'fs-extra'
import request from './request'
import { version } from '../package.json'
const { existsSync, mkdirpSync, readFileSync, writeFile, writeFileSync } = fsExtra
program
  .option("--init", "初始化项目")
  .option("-g, --generate [template]", "生成代码")
  .option("-p, --pull", "拉取数据源数据")
  .option("-f, --force", "强制拉取")
  .version(version, '-v, --version', "版本号")

program.parse()

const options = program.opts();
console.log(options)
if (options.init) { // 初始化
  initCodeGenerate()
}

function initCodeGenerate() {
  if (exitsConfig()) {
    console.log(chalk.red(`${CONFIG_NAME} 文件已存在`))
  } else {
    if (!existsSync(GEN_FOLDER_PATH)) {
      mkdirpSync(GEN_FOLDER_PATH)
    }
    writeConfig(DEFAULT_CONFIG)
  }
  const gitignore = `${cwd()}/.gitignore`
  if (!existsSync(gitignore)) {
    writeFileSync(gitignore, `### Generate Code ###\n${GEN_FOLDER_NAME}`, { encoding: 'utf-8'})
  } else {
    const data = readFileSync(gitignore, 'utf-8')
    if (data.indexOf("### Generate Code ###") >= 0) {
      return
    }
    writeFileSync(gitignore, `${data}\n\n### Generate Code ###\n${GEN_FOLDER_NAME}`, { encoding: 'utf-8'})
  }

}




if (options.generate) {
  generateCode()
}


if (options.pull) {
  pullDataSource(options.force)
}





async function getTableInfo() {
  const file = `${GEN_FOLDER_PATH}/${TABLE_JSON}`
  if (existsSync(file)) {
    return JSON.parse(readFileSync(file, 'utf-8'))
  } else {
    const config = getConfig()
    const res = await request.get(`${config.baseApi}/generate/query/tables`, {
      params: {
        withFields: true
      }
    })
    if (!existsSync(GEN_FOLDER_PATH)){
      mkdirpSync(GEN_FOLDER_PATH)
    }
    writeFile(file, JSON.stringify(res, null, 2), 'utf8')
    return res
  }
}

async function generateCode() {
  const config = getConfig()
  let template = options.generate != true ? options.generate : ''
  let table = '';
  if (template == '') {
    const answer = await inquirer.prompt({
      type: 'list',
      name: 'template',
      message: '请选择模板',
      choices: ['java_base', 'java_pojo_01']
    })
    template = answer.template
    if (template != 'java_base') {
      const tableInfo = await getTableInfo() || []
      const answer = await inquirer.prompt({
        type: 'checkbox',
        name: 'table',
        message: '请选择表',
        choices: tableInfo.map(item => item.tableName)
      })
      table = answer.table.join(',')
    }
  }
  request.post(`${config.baseApi}/generate/file/${template}/${table||'base'}`)
}

function pullDataSource(force: boolean) {
  const file = `${GEN_FOLDER_PATH}/${TABLE_JSON}`
  if (existsSync(file) && !force) {
    console.log(chalk.red('已存在数据源'))
    return
  }
  const config = getConfig()
  request.get(`${config.baseApi}/generate/query/tables`, {
    params: {
      withFields: true
    }
  }).then(res => {
    if (!existsSync(GEN_FOLDER_PATH)){
      mkdirpSync(GEN_FOLDER_PATH)
    }
    writeFileSync(file, JSON.stringify(res, null, 2), 'utf8')
  })
}
