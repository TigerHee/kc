import { builtinModules } from 'module'

// node 内置模块
export const NODE_BUILTINS = builtinModules
  .filter(m => !m.startsWith('_') && !m.includes('/'))
  .reduce((acc, m) => {
    acc.push(m)
    acc.push(`node:${m}`)
    return acc
  }, [] as string[])
