import { defineCommand } from '../types'


export default defineCommand<'-v, --version'>({
  flags: '-v, --version',
  execute(ctx) {
    if (ctx.version) {
      console.log("v"+ctx.packageVersion)
    }
  },
})
