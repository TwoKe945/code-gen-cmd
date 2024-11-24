import { Expect } from './expect'

type CommandOptionName<T extends string> = 
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

 
type A = Expect<CommandOptionName<'--init'>, { init: boolean }> // true
const a:A = true
type B = Expect<CommandOptionName<'--init [char]'>, { init: string | boolean }> // true
const b:B = true
type C = Expect<CommandOptionName<'--init <char>'>, { init: string }>  // true
const c:C = true
type D = Expect<CommandOptionName<'-c, --init'>, { init: boolean }>  // true
const d:D = true
type E = Expect<CommandOptionName<'-c, --init <char>'>, { init: string }>  // true
const e:E = true
type F = Expect<CommandOptionName<'-c, --init [char]'>, { init: string | boolean }>  // true
const f:F = true
type G = Expect<CommandOptionName<'-ct, --custom-template [char]'>, { customTemplate: string | boolean }>  // true
const g:G = true
type H = Expect<CommandOptionName<'-ct, --custom-template-admin [char]'>, { customTemplateAdmin: string | boolean }>  // true
const h:H = true
type H1 = Expect<CommandOptionName<'-ct, --custom-template-admin-test [char]'>, { customTemplateAdminTest: string | boolean }>  // true
const h1:H1 = true
type H2 = Expect<CommandOptionName<'-v, --version'>, { version: boolean }>  // true
const h2:H2 = true
