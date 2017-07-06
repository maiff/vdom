import _ from './until'
class Element{
  constructor(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children || []
    this.key = props
    ? props.key
    : void 0

    let count = 0

    _.each(this.children, function (child, i) {
      if (child instanceof Element) {
        count += child.count
      } else {
        children[i] = '' + child
      }
      count++
    })

  this.count = count
  }
  render() {
    let el = document.createElement(this.tagName)
    let props = this.props
    for (const propName in props) { // 设置节点的DOM属性
      let propValue = props[propName]
      _.setAttr(el, propName, propValue)
    }

    let children = this.children

    children.forEach((child) => {
      let childEl = (child instanceof Element)
      ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
      : document.createTextNode(child) // 如果字符串，只构建文本节点
      el.appendChild(childEl)
    })
    return el
  }
}

export default function el(tagName, props, children) {
  if (Array.isArray(props)) {
    children = props
    props = {}
  }
  return new Element(tagName, props, children)
}