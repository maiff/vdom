const _ = {
  type: function (obj) {
  return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '')
  },
  isArray: function(arg) {
    return Array.isArray(arg)
  },
  isString: function(arg) {
    return _.type(arg) === 'String'
  },
  slice: function(arrayLike, index) {
    return Array.prototype.slice.call(arrayLike, index)
  },
  setAttr: function(node, key, value) {
    switch (key) {
      case 'style':
        node.style.cssText = value
        break
      case 'value':
        var tagName = node.tagName || ''
        tagName = tagName.toLowerCase()
        if (
          tagName === 'input' || tagName === 'textarea'
        ) {
          node.value = value
        } else {
          // if it is not a input or textarea, use `setAttribute` to set
          node.setAttribute(key, value)
        }
        break
      default:
        node.setAttribute(key, value)
        break
    }
  },
  each: function(array, fn) {
    for (let i = 0, len = array.length; i < len; i++) {
      fn(array[i], i)
    }
  },
  toArray: function(arrayLike) {
    return Array.from(arrayLike)
  }
}

export default _