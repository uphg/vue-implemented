import './style.css'
import { renderer } from './renderer'

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
