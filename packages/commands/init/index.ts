import { defineCommand } from '../types'
import chalk from 'chalk'
import { cwd } from 'process'
import fsExtra from 'fs-extra'
import { exitsConfig, CONFIG_NAME, GENERATE_FOLDER_PATH, GENERATE_FOLDER_NAME, DEFAULT_CONFIG, writeConfig } from '@code-gen-bin/shared'

const { existsSync, mkdirpSync, writeFileSync, readFileSync } = fsExtra

function initCodeGenerate() {
  if (exitsConfig()) {
    console.log(chalk.red(`${CONFIG_NAME} 文件已存在`))
  } else {
    if (!existsSync(GENERATE_FOLDER_PATH)) {
      mkdirpSync(GENERATE_FOLDER_PATH)
    }
    writeConfig(DEFAULT_CONFIG)
  }
  const gitignore = `${cwd()}/.gitignore`
  if (!existsSync(gitignore)) {
    writeFileSync(gitignore, `### Generate Code ###\n${GENERATE_FOLDER_NAME}`, { encoding: 'utf-8'})
  } else {
    const data = readFileSync(gitignore, 'utf-8')
    if (data.indexOf("### Generate Code ###") >= 0) {
      return
    }
    writeFileSync(gitignore, `${data}\n\n### Generate Code ###\n${GENERATE_FOLDER_NAME}`, { encoding: 'utf-8'})
  }

}

export default defineCommand({
  flags: '--init',
  description: '初始化项目',
  execute(ctx) {
    if (ctx.init) {
      initCodeGenerate()
    }
  }
})
