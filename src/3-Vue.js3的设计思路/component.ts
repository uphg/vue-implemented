// --- 3.3 组件的本质
type Render = () => VNode
type Component = { render: Render }

type VNode = {
  tag: string | Component,
  props: Record<string, any>,
  children: VNode[] | string,
  render?: Render
}

export function renderer(vnode: VNode, container: HTMLElement) {
  const { tag } = vnode
  if (typeof tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof tag === 'object' && tag !== null) {
    mountComponent(vnode, container)
  }
}

function mountElement(vnode: VNode, container: HTMLElement) {
  const el = document.createElement(vnode.tag as string)

  for (const key in vnode.props) {
    if (/^on/.test(key)) {
      // 获取事件名称
      const eventName = key.substring(2).toLowerCase()
      el.addEventListener(eventName, vnode.props[key])
    }
  }

  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }

  container.appendChild(el)
}

function mountComponent(vnode: VNode, container: HTMLElement) {
  const subtree = (vnode.tag as Component).render()
  renderer(subtree, container)
}

// --- run
const app = document.querySelector<HTMLDivElement>('#app')!

// MyComponent 是一个对象
const MyComponent = {
  render() {
    return {
      tag: 'div',
      props: {
        onClick: () => alert('hello')
      },
      children: 'click MyComponent'
    }
  }
}

const vnode = {
  tag: MyComponent,
  props: {
    onClick: () => alert('hello')
  },
  children: 'click me'
}

renderer(vnode, app)