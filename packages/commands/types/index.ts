export type CommandOptionName<T extends string> =
T extends `-${infer _K}, --${infer Flag} [${infer _K}]`? { [ _Key in Underline2BigHump<Flag> ]: string | boolean } : 
T extends `-${infer _K}, --${infer Flag} <${infer _K}>`? { [ _Key in Underline2BigHump<Flag> ]: string } : 
T extends `-${infer _K}, --${infer Flag}`? { [ _Key in Underline2BigHump<Flag> ]: boolean } : 
T extends `--${infer Flag} [${infer _K}]` ? { [ _Key in Underline2BigHump<Flag> ]: string | boolean } :
T extends `--${infer Flag} <${infer _K}>` ? { [ _Key in Underline2BigHump<Flag> ]: string} :
T extends `--${infer Flag}` ? { [ _Key in Underline2BigHump<Flag> ]: boolean } :
never

type LinkText<A extends string, B extends string> = `${A}${B}`
type CapFirst<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;
type Underline2BigHump<T extends string> = T extends `${infer Prefix}-${infer Suffix}` ?  LinkText<Prefix, Underline2BigHump<CapFirst<Suffix>>>  : T;

interface Context {
  local: boolean
  force: boolean
  packageVersion: string
}


export interface Command<T extends string> {
  flags: T,
  description?: string,
  defaultValue?: string | boolean | string[],
  execute: (ctx: Context & CommandOptionName<T> ) => void
}

export function defineCommand<T extends string>(command: Command<T>) {
  return command;
}
