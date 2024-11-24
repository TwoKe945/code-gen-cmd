import { defineCommand } from '../types'
import inquirer from 'inquirer'
import fsExtra from 'fs-extra'
import { GENERATE_FOLDER_PATH, TABLE_JSON, getConfig, request } from '@code-gen-bin/shared'

const { existsSync, mkdirpSync, writeFileSync, readFileSync } = fsExtra

async function getTableInfo(force: boolean) {
  const file = `${GENERATE_FOLDER_PATH}/${TABLE_JSON}`
  if (existsSync(file) && !force) {
    return JSON.parse(readFileSync(file, 'utf-8'))
  } else {
    const config = getConfig()
    const res = await request.get(`${config.baseApi}/generate/query/tables`, {
      params: {
        withFields: true
      }
    })
    if (!existsSync(GENERATE_FOLDER_PATH)){
      mkdirpSync(GENERATE_FOLDER_PATH)
    }
    writeFileSync(file, JSON.stringify(res, null, 2), 'utf8')
    return res
  }
}

async function generateCode(force: boolean, generate: string | boolean, local: boolean) {
  const config = getConfig()
  let template = generate != true ? generate : ''
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
      const tableInfo = await getTableInfo(force) || []
      const answer = await inquirer.prompt({
        type: 'checkbox',
        name: 'table',
        message: '请选择表',
        choices: tableInfo.map(item => item.tableName)
      })
      table = answer.table.join(',')
    }
  }
  let params: any = {}
  if (local) {
    const tableData = JSON.parse(readFileSync(`${GENERATE_FOLDER_PATH}/${TABLE_JSON}`, { encoding: 'utf8' }));
    params = (tableData as Array<any>||[]).reduce((config, item) => {
      if (table.indexOf(item.tableName) != -1) {
        config[item.tableName] = item
      }     
      return config
    }, {})
  }

  request.post(`${config.baseApi}/generate/file/${template}/${table||'base'}`, params)
}

export default defineCommand({
  flags: '-g, --generate [template]',
  description: '生成代码',
  execute(ctx) {
    if (ctx.generate) {
      generateCode(ctx.force, ctx.generate, ctx.local)
    }
  },
})
