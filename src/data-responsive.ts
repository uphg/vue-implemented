import { ObjectLike, Fn } from "./types"

// 简单的响应式实现
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

export {}