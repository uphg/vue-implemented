// --- 4.5 嵌套的 effect 与 effect 栈
import { Fn, ObjectLike } from "../types"

interface ActiveEffect {
  (): void,
  deps?: any[]
} 

let activeEffect: ActiveEffect | undefined
const effectStack: ActiveEffect[] = []  // 新增

const bucket = new WeakMap<ObjectLike, any>()

const data = { ok: true, text: 'hello world', text2: 'Hi, I\'m Jack' }

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
    effectStack.push(effectFn)
    fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
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
const app = document.querySelector('#app') as HTMLElement
const div1 = document.createElement('div')
const div2 = document.createElement('div')
app.appendChild(div1)
app.appendChild(div2)

effect(function effectFn1() {
  effect(function effectFn2() {
    div2.innerText = obj.text2  
  })
  div1.innerText = obj.text
})

obj.text = 1
obj.text2 = 2