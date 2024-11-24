import { CONFIG_NAME, GENERATE_FOLDER_PATH, TEMPLATE_FOLDER_PATH } from '../constant'
import fsExtra from 'fs-extra'
const { existsSync, readFileSync, writeFileSync }  = fsExtra

interface CodeGenConfig {
  baseApi: string
  package: string
  url: string
  username: string
  password: string
  type?: string
  templates?: string[]
}

export function getGenerateConfigPath() {
  return `${GENERATE_FOLDER_PATH}\\${CONFIG_NAME}`
}

export function exitsConfig() {
  return existsSync(getGenerateConfigPath())
}


export function getGenerateWorkspacePath() {
  return GENERATE_FOLDER_PATH
}

export function getTemplateWorkspacePath() {
  return TEMPLATE_FOLDER_PATH
}

export function getConfig(): CodeGenConfig {
  return JSON.parse(readFileSync(getGenerateConfigPath(), 'utf-8')) as CodeGenConfig
}

export function writeConfig(config: Record<string, any>) {
  return writeFileSync(getGenerateConfigPath(), JSON.stringify(config, null, 2), { encoding: 'utf-8' })
}
