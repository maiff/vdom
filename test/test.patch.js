import el from '../src/Element'
import diff from '../src/diff'
import patch from '../src/patch'

var root = el('div', {id: 'content'}, [
      el('p', ['I love you']),
      el('div', ['I love you']),
      el('section', ['I love you'])
    ])

var root2 = el('div', {id: 'content'}, [
  el('p', ['I love you']),
  el('div', {name: 'Jerry'}, ['I love you']),
  el('section', ['I love you'])
])

var dom = root.render()
var patches = diff(root, root2)
console.log(patches)