const arr = reactive(['foo'])

effect(() => {
  for (const key in arr) {
    console.log(key)
  }
})

arr[1] = 'bar' // 能够触发副作用函数重新执行
arr.length = 0 // 能够触发副作用函数重新执行