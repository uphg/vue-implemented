// --- 分支的切换和 cleanup

import { Fn, ObjectLike } from "./types"

interface ActiveEffect {
  (): void,
  deps?: any[]
} 

let activeEffect: ActiveEffect | undefined

const bucket = new WeakMap<ObjectLike, any>()

const data = { ok: true, text: 'hello world' }

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
  console.log(`\n获取 --- obj.${key as string}`)
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()))
  }

  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }
  deps.add(activeEffect)
  if (!activeEffect) return
  activeEffect.deps?.push(deps) // 新增
}

function trigger(target: ObjectLike, key: string | symbol) {
  console.log(`\n设置 --- obj.${key as string}`)
  const depsMap = bucket.get(target)

  if (!depsMap) return
  const effects: Fn[] = depsMap.get(key)
  const effectsToRun = new Set(effects)

  effectsToRun.forEach((effectFn) => {
    effectFn()
  })
}

function effect(fn: Fn) {
  const effectFn: ActiveEffect = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
  }
  effectFn.deps = []
  effectFn()
}

// 清除之前 track 收集 effect 中的依赖
function cleanup(effectFn: ActiveEffect) {
  if (!effectFn.deps) return
  for (const deps of effectFn.deps) {
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// --- 运行
const app = document.createElement('div')
app.id = '#app'
document.body.appendChild(app)

effect(function effectFn() {
  console.log('effect 函数更新')
  app.innerText = obj.ok ? obj.text : 'not'
})

obj.ok = false
obj.text = 1
obj.text = 2
obj.text = 3