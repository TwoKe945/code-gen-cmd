import axios from 'axios'
import { getConfig, exitsConfig } from '../config'
import { cwd } from 'process'

const instance = axios.create({
  timeout: 300_0000
})

instance.interceptors.request.use(config => {
  if (!exitsConfig()) {
    throw new Error('请先配置配置文件')
  }
  const configData = getConfig()
  config.headers['package'] = configData.package;
  config.headers['url'] = configData.url;
  config.headers['username'] = configData.username;
  config.headers['password'] = configData.password;
  config.headers['type'] = configData.type;
  config.headers['cwd'] = cwd();
  return config
})

instance.interceptors.response.use(resp => {
  return resp.data
})

export default instance;
