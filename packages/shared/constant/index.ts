import { cwd } from 'process'

/**
 * 命令工作目录
 */
export const GENERATE_FOLDER_NAME = `.generate`
/**
 * 模板目录
 */
export const TEMPLATE_FOLDER_NAME = `templates`
/**
 * 命令工作路径
 */
export const GENERATE_FOLDER_PATH = `${cwd()}/${GENERATE_FOLDER_NAME}`
/**
 * 模板路径
 */
export const TEMPLATE_FOLDER_PATH = `${GENERATE_FOLDER_PATH}/${TEMPLATE_FOLDER_NAME}`
/**
 * 表信息文件
 */
export const TABLE_JSON = `tables.json`
/**
 * 配置文件
 */
export const CONFIG_NAME = "code-gen.json";
/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  "baseApi": "http://localhost:8080",
  "url": "jdbc:mysql://xxx.xxx.xxx.xxx:3306/xxxxx?serverTimezone=GMT%2B8&useUnicode=true&characterEncoding=utf8&autoReconnect=true&useSSL=false",
  "username": "xxxx",
  "password": "xxxx",
  "type": "mysql",
  "package": "xxxxx"
}
