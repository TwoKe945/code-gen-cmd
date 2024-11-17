import { cwd } from 'process'

export const GEN_FOLDER_NAME = `.generate`
export const GEN_FOLDER_PATH = `${cwd()}/${GEN_FOLDER_NAME}`
export const TABLE_JSON = `tables.json`
export const CONFIG_NAME = "code-gen.json";

export const DEFAULT_CONFIG = {
  "baseApi": "http://localhost:8080",
  "url": "jdbc:mysql://xxx.xxx.xxx.xxx:3306/xxxxx?serverTimezone=GMT%2B8&useUnicode=true&characterEncoding=utf8&autoReconnect=true&useSSL=false",
  "username": "xxxx",
  "password": "xxxx",
  "type": "mysql",
  "package": "xxxxx"
}
