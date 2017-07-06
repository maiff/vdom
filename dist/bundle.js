(function (exports) {
'use strict';

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
        node.style.cssText = value;
        break
      case 'value':
        var tagName = node.tagName || '';
        tagName = tagName.toLowerCase();
        if (
          tagName === 'input' || tagName === 'textarea'
        ) {
          node.value = value;
        } else {
          // if it is not a input or textarea, use `setAttribute` to set
          node.setAttribute(key, value);
        }
        break
      default:
        node.setAttribute(key, value);
        break
    }
  },
  each: function(array, fn) {
    for (let i = 0, len = array.length; i < len; i++) {
      fn(array[i], i);
    }
  },
  toArray: function(arrayLike) {
    return Array.from(arrayLike)
  }
};

class Element{
  constructor(tagName, props, children) {
    this.tagName = tagName;
    this.props = props;
    this.children = children || [];
    this.key = props
    ? props.key
    : void 0;

    let count = 0;

    _.each(this.children, function (child, i) {
      if (child instanceof Element) {
        count += child.count;
      } else {
        children[i] = '' + child;
      }
      count++;
    });

  this.count = count;
  }
  render() {
    let el = document.createElement(this.tagName);
    let props = this.props;
    for (const propName in props) { // 设置节点的DOM属性
      let propValue = props[propName];
      _.setAttr(el, propName, propValue);
    }

    let children = this.children;

    children.forEach((child) => {
      let childEl = (child instanceof Element)
      ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
      : document.createTextNode(child); // 如果字符串，只构建文本节点
      el.appendChild(childEl);
    });
    return el
  }
}

function el(tagName, props, children) {
  if (Array.isArray(props)) {
    children = props;
    props = {};
  }
  return new Element(tagName, props, children)
}

const REPLACE = 0;
const REORDER = 1;
const PROPS   = 2;
const TEXT    = 3;

/**
 * Diff two list in O(N).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function listDiff (oldList, newList, key) {
  // console.log(JSON.stringify(oldList), '+++++++',JSON.stringify(newList))
  var oldMap = makeKeyIndexAndFree(oldList, key);
  var newMap = makeKeyIndexAndFree(newList, key);

  var newFree = newMap.free;

  var oldKeyIndex = oldMap.keyIndex;
  var newKeyIndex = newMap.keyIndex;

  var moves = [];

  // a simulate list to manipulate
  var children = [];
  var i = 0;
  var item;
  var itemKey;
  var freeIndex = 0;

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i];
    itemKey = getItemKey(item, key);
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null);
      } else {
        var newItemIndex = newKeyIndex[itemKey];
        children.push(newList[newItemIndex]);
      }
    } else {
      var freeItem = newFree[freeIndex++];
      children.push(freeItem || null);
    }
    i++;
  }

  var simulateList = children.slice(0);

  // remove items no longer exist
  i = 0;
  while (i < simulateList.length) {
    if (simulateList[i] === null) {
      remove(i);
      removeSimulate(i);
    } else {
      i++;
    }
  }

  // i is cursor pointing to a item in new list
  // j is cursor pointing to a item in simulateList
  var j = i = 0;
  while (i < newList.length) {
    item = newList[i];
    itemKey = getItemKey(item, key);

    var simulateItem = simulateList[j];
    var simulateItemKey = getItemKey(simulateItem, key);

    if (simulateItem) {
      if (itemKey === simulateItemKey) {
        j++;
      } else {
        // new item, just inesrt it
        if (!oldKeyIndex.hasOwnProperty(itemKey)) {
          insert(i, item);
        } else {
          // if remove current simulateItem make item in right place
          // then just remove it
          var nextItemKey = getItemKey(simulateList[j + 1], key);
          if (nextItemKey === itemKey) {
            remove(i);
            removeSimulate(j);
            j++; // after removing, current j is right, just jump to next one
          } else {
            // else insert item
            insert(i, item);
          }
        }
      }
    } else {
      insert(i, item);
    }

    i++;
  }

  //if j is not remove to the end, remove all the rest item
  var k = simulateList.length - j;
  while (j++<simulateList.length){
    k--;
    remove(k+i);
    console.log(j, k, i);
  }

  function remove (index) {
    var move = {index: index, type: 0};
    moves.push(move);
  }

  function insert (index, item) {
    var move = {index: index, item: item, type: 1};
    moves.push(move);
  }

  function removeSimulate (index) {
    simulateList.splice(index, 1);
  }

  return {
    moves: moves,
    children: children
  }
}

/**
 * Convert list to key-item keyIndex object.
 * @param {Array} list
 * @param {String|Function} key
 */
function makeKeyIndexAndFree (list, key) {
  var keyIndex = {};
  var free = [];
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i];
    var itemKey = getItemKey(item, key);
    if (itemKey) {
      keyIndex[itemKey] = i;
    } else {
      free.push(item);
    }
  }
  return {
    keyIndex: keyIndex,
    free: free
  }
}

function getItemKey (item, key) {
  if (!item || !key) return void 666
  return typeof key === 'string'
    ? item[key]
    : key(item)
}

function diff(oldTree, newTree) {
  let index = 0;
  let patches = {};
  dfsWalk(oldTree, newTree, index, patches);
  return patches
}

function dfsWalk(oldNode, newNode, index, patches) {
  let currentPatch = [];

  if (newNode === null) {
    // Real DOM node will be removed when perform reordering, so has no needs to do anthings in here
  // TextNode content replacing
  } else if (_.isString(oldNode) && _.isString(newNode)) {
    if (newNode !== oldNode) {
      currentPatch.push({ type: TEXT, content: newNode});
    }
  // Nodes are the same, diff old node's props and children
  } else if (
    oldNode.tagName === newNode.tagName &&
    oldNode.key === newNode.key
  ) {
    // Diff props
    let propsPatches = diffProps(oldNode, newNode);
    if (propsPatches) {
      currentPatch.push({ type: PROPS, props: propsPatches });
    }
    // Diff children. If the node has a `ignore` property, do not diff children
    if (!isIgnoreChildren(newNode)) {
      diffChildren(
        oldNode.children,
        newNode.children,
        index,
        patches,
        currentPatch
      );
    }
  }// Nodes are not the same, replace the old node with new node
  else {
    currentPatch.push({ type: REPLACE, node: newNode });
  }

  if (currentPatch.length) {
    patches[index] = currentPatch;
  }
}

function diffChildren (oldChildren, newChildren, index, patches, currentPatch) {
  let diffs = listDiff(oldChildren, newChildren, 'key');
  newChildren = diffs.children;
  // console.log('newChildren:', newChildren)
  if (diffs.moves.length) {
    let reorderPatch = { type: REORDER, moves: diffs.moves };
    currentPatch.push(reorderPatch);
  }
  let leftNode = null;
  let currentNodeIndex = index;
  _.each(oldChildren, function (child, i) {
    let newChild = newChildren[i];
    currentNodeIndex = (leftNode && leftNode.count)
      ? currentNodeIndex + leftNode.count + 1
      : currentNodeIndex + 1;
    dfsWalk(child, newChild, currentNodeIndex, patches);
    leftNode = child;
  });
}


function diffProps (oldNode, newNode) {
  let count = 0;
  let oldProps = oldNode.props;
  let newProps = newNode.props;

  let key, value;
  let propsPatches = {};

  // Find out different properties
  for (key in oldProps) {
    value = oldProps[key];
    if (newProps[key] !== value) {
      count++;
      propsPatches[key] = newProps[key];
    }
  }

  // Find out new property
  for (key in newProps) {
    value = newProps[key];
    if (!oldProps.hasOwnProperty(key)) {
      count++;
      propsPatches[key] = newProps[key];
    }
  }

  // If properties all are identical
  if (count === 0) {
    return null
  }

  return propsPatches
}

function isIgnoreChildren (node) {
  return (node.props && node.props.hasOwnProperty('ignore'))
}

const DIFF2 = 0;

const status = DIFF2;
function patch (node, patches) {
  let walker = {index: 0};
  dfsWalk$1(node, walker, patches);
}

function dfsWalk$1 (node, walker, patches) {
  let currentPatches = patches[walker.index];

  let len = node.childNodes
    ? node.childNodes.length
    : 0;
  for (let i = 0; i < len; i++) {
    let child = node.childNodes[i];
    walker.index++;
    dfsWalk$1(child, walker, patches);
  }

  if (currentPatches) {
    applyPatches(node, currentPatches);
  }
}

function applyPatches (node, currentPatches) {
  _.each(currentPatches, function (currentPatch) {
    switch (currentPatch.type) {
      case REPLACE:
        let newNode = (typeof currentPatch.node === 'string')
          ? document.createTextNode(currentPatch.node)
          : currentPatch.node.render();
        node.parentNode.replaceChild(newNode, node);
        break
      case REORDER:
        reorderChildren(node, currentPatch.moves);
        break
      case PROPS:
        setProps(node, currentPatch.props);
        break
      case TEXT:
        if (node.textContent) {
          node.textContent = currentPatch.content;
        } else {
          // fuck ie
          node.nodeValue = currentPatch.content;
        }
        break
      default:
        throw new Error('Unknown patch type ' + currentPatch.type)
    }
  });
}

function setProps (node, props) {
  for (let key in props) {
    if (props[key] === void 666) {
      node.removeAttribute(key);
    } else {
      let value = props[key];
      _.setAttr(node, key, value);
    }
  }
}
function reorderChildren (node, moves) {
  let staticNodeList = _.toArray(node.childNodes);
  let maps = {};

  _.each(staticNodeList, function (node) {
    if (node.nodeType === 1) {
      let key = node.getAttribute('key');
      if (key) {
        maps[key] = node;
      }
    }
  });

  _.each(moves, function (move) {
    let index = move.index;
    if (status ? move.type === -1 : move.type === 0) { // remove item
      if (staticNodeList[index] === node.childNodes[index]) { // maybe have been removed for inserting
        node.removeChild(node.childNodes[index]);
      }
      staticNodeList.splice(index, 1);
    } else if (move.type === 1) { // insert item
      let insertNode = maps[move.item.key]
        ? maps[move.item.key].cloneNode(true) // reuse old item
        : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item);
      staticNodeList.splice(index, 0, insertNode);
      node.insertBefore(insertNode, node.childNodes[index] || null);
    }
    else if (status && move.type === 0) {
      let replaceNode = maps[move.item.key]
        ? maps[move.item.key].cloneNode(true) // reuse old item
        : (typeof move.item === 'object')
            ? move.item.render()
            : document.createTextNode(move.item);
      staticNodeList.splice(index, 1, replaceNode);
      // console.log(replaceNode, node.childNodes[index])
      node.replaceChild(replaceNode, node.childNodes[index] || null);
    }
  });
}

exports.el = el;
exports.diff = diff;
exports.patch = patch;

}((this.vdom = this.vdom || {})));
