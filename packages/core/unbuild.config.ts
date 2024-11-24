import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index'
  ],
  // 清除输出目录
  clean: true,
  declaration: false
})
