import { defineCommand } from '../types'
import fsExtra from 'fs-extra'
import chalk from 'chalk'
import { getConfig, request, GENERATE_FOLDER_PATH, TABLE_JSON } from '@code-gen-bin/shared'

const { existsSync, mkdirpSync, writeFileSync, readFileSync } = fsExtra

function pullDataSource(force: boolean) {
  const file = `${GENERATE_FOLDER_PATH}/${TABLE_JSON}`
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
    if (!existsSync(GENERATE_FOLDER_PATH)){
      mkdirpSync(GENERATE_FOLDER_PATH)
    }
    writeFileSync(file, JSON.stringify(res, null, 2), 'utf8')
  })
}


export default defineCommand({
  description: '拉取数据源数据',
  flags: '-p, --pull',
  execute(ctx) {
    if (ctx.pull) {
      pullDataSource(ctx.force)
    }
  }
})
