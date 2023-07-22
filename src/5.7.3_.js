const obj = {}
const arr = reactive([obj])

console.log(arr.includes(obj))  // true