import { readonly } from './core'

const obj = readonly({ foo: 1 })
// 尝试修改数据，会得到警告
obj.foo = 2