function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'function') {
    const component = vnode.tag()
    renderer(component, container)
  } else  if (typeof vnode.tag === 'object') { // 如果是对象，说明 vnode 描述的是组件
    const subtree = vnode.tag.render()
    renderer(subtree, container)
  }
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)
  for (const key in vnode.props) {
    // 处理事件
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substr(2).toLowerCase(), // 事件名称 onClick ---> click
        vnode.props[key]
      )
    }
  }
  // 处理 children
  if (typeof vnode.children === 'string') {
    el.appendChild(document.createTextNode(vnode.children))
  } else if (Array.isArray(vnode.children)) {
    vnode.children.forEach(child => renderer(child, el))
  }
  container.appendChild(el)
}

const MyComponent1 = function () {
  return {
    tag: 'div',
    props: {
      onClick: () => alert('Function Component hello')
    },
    children: 'Click Function Component'
  }
}

// 对象形式
const MyComponent2 = {
  render() {
    return {
      tag: 'div',
      props: {
        onClick: () => alert('Object Component hello')
      },
      children: 'Click Object Component'
    }
  }
}

const vnode1 = {
  tag: MyComponent1
}

const vnode2 = {
  tag: MyComponent2
}

renderer(vnode1, document.body)
renderer(vnode2, document.body)
