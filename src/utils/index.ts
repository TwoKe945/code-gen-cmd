import { cwd } from "process";
import { CONFIG_NAME, GEN_FOLDER_PATH } from '../constants'
import fsExtra from 'fs-extra'
const { existsSync, readFileSync, writeFileSync }  = fsExtra
interface CodeGenConfig {
  baseApi: string
  package: string
  url: string
  username: string
  password: string
  type?: string
}

export function getConfigPath() {
  return `${GEN_FOLDER_PATH}\\${CONFIG_NAME}`
}

export function exitsConfig() {
  return existsSync(getConfigPath())
}

export function getConfig(): CodeGenConfig {
  return JSON.parse(readFileSync(getConfigPath(), 'utf-8')) as CodeGenConfig
}

export function writeConfig(config: Record<string, any>) {
  return writeFileSync(getConfigPath(), JSON.stringify(config, null, 2), { encoding: 'utf-8' })
}
