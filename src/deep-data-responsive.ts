import { Fn, ObjectLike } from "./types"

// 深度数据响应式（对应属性值修改响应）
let activeEffect: Fn | undefined

function effect(fn: Fn) {
  activeEffect = fn
  fn()
}

const bucket = new WeakMap<ObjectLike, any>()

const data = { text: 'hello world' }

const obj = new Proxy(data, {
  get(target: ObjectLike, key) {
    if (activeEffect) {
      track(target, key)
    }
    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    trigger(target, key)
    return true
  }
})

function track(target: ObjectLike, key: string | symbol) {
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
}

function trigger(target: ObjectLike, key: string | symbol) {
  const depsMap = bucket.get(target)
  if (!depsMap) return
  const effects = depsMap.get(key)
  effects && effects.forEach((fn: Fn) => fn())
}

// --- 运行
const app = document.createElement('div')
app.id = '#app'

effect(() => {
  document.body.appendChild(app)
})

effect(() => {
  app.innerText = obj.text
})

// --- 数据结构示意图

// bucket: WeakMap = [
//   [[target1], depsMap: Map [
//     [key, value: Set [
//       fn: Fn // effect 函数
//       ...
//     ]]
//   ]],
//   [[target2], depsMap: Map [
//     [key, value: Set [
//       fn: Fn // effect 函数
//       ...
//     ]]
//   ]]
//   ...
// ]