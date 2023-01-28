// --- 4.2 响应式数据的基本实现
import { ObjectLike, Fn } from "../types"

const bucket = new Set<Fn>()

const data = { text: 'hello world' }

const obj = new Proxy(data, {
  get(target: ObjectLike, key) {
    bucket.add(effect)
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    bucket.forEach(fn => fn())
    return true
  }
})

function effect() {
  document.body.innerText = obj.text
}

effect()

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

export {}