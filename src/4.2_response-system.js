// 4.2 一个完善的响应系统

const bucket = new WeakMap()

const obj = new Proxy(data, {
  get(target, key) {
    if (!activeEffect) return target[key]
    let depsMap = bucket.get(target)
    if (!depsMap) {
      depsMap = new Map()
      bucket.set(target, depsMap)
    }
    let deps = depsMap.get(key)
    if (!deps) {
      deps = new Set()
      depsMap.set(key, deps)
    }
    deps.add(activeEffect)

    return target[key]
  },
  set(target, key, newVal) {
    target[key] = newVal
    const depsMap = bucket.get(target)
    if (!depsMap) return
    const effects = depsMap.get(key)
    effects && effects.forEach(fn => fn())
  }
})


// 对上面代码进行封装


// 再次优化代码
