import init from './init'
import pull from './pull'
import generate from './generate'
import version from './version'
import customTemplate from './custom-template'
import { Command } from 'commander'

const commands = [init, pull, generate, customTemplate, version]

export interface ExecuteOptions {
  packageVersion: string
}


export  function withOptions(program: Command) {
  commands.forEach(command => {
    program.option(command.flags, command.description, command.defaultValue)
  })
  program.option('-f, --force', '强制执行')
  program.option('-l, --local', '本地配置生成')
  return [
    (options: ExecuteOptions) => {
      program.parse()
      const opts = program.opts()
      commands.forEach(command => {
        if (command.execute) {
          command.execute({ ...opts as any, ...options})
        }
      })
    }
  ] as const
}
