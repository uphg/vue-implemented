import { reactive, effect } from './core'

const obj = reactive({ foo: { bar: 1 } })

effect(() => {
  console.log(obj.foo.bar)
})
// 修改 obj.foo.bar 的值，并不能触发响应
obj.foo.bar = 2