import { reactive, effect } from "./core"

const arr = reactive([])
// 第一个副作用函数
effect(() => {
  arr.push(1)
})

// 第二个副作用函数
effect(() => {
  arr.push(1)
})

console.log('arr')
console.log(arr)