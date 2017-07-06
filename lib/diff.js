/**
 * Diff two list in O(N*M).
 * @param {Array} oldList - Original List
 * @param {Array} newList - List After certain insertions, removes, or moves
 * @param {String} key - want to compare key
 * @return {Object} - {moves: <Array>}
 *                  - moves is a list of actions that telling how to remove and insert
 */
function listDiff (oldList, newList, key) {
  let len1 = oldList.length
  let len2 = newList.length

  var oldMap = makeKeyIndexAndFree(oldList, key)
  var newMap = makeKeyIndexAndFree(newList, key)
  let children = []
  var oldKeyIndex = oldMap.keyIndex
  var newKeyIndex = newMap.keyIndex
  var newFree = newMap.free
  let i = 0
  var item
  var itemKey
  var freeIndex = 0

  // fist pass to check item in old list: if it's removed or not
  while (i < oldList.length) {
    item = oldList[i]
    itemKey = getItemKey(item, key)
    if (itemKey) {
      if (!newKeyIndex.hasOwnProperty(itemKey)) {
        children.push(null)
      } else {
        var newItemIndex = newKeyIndex[itemKey]
        children.push(newList[newItemIndex])
      }
    } else {
      var freeItem = newFree[freeIndex++]
      children.push(freeItem || null)
    }
    i++
  }

  let dp = []

  for (let i = 0; i <= len1; i++) {
    dp[i] = []
    dp[i][0] = i
  }
  dp[0] = []
  for (let j = 0; j <= len2; j++) {
    dp[0][j] = j
  }
  let map = {}
  let moves = []
  for (let i = 1; i <= len1; i++) {
    for(let j = 1; j <= len2; j++) {
      let insertion = dp[i][j-1] + 1
      let deletion = dp[i-1][j] + 1
      let replace = dp[i-1][j-1] + (oldList[i-1][key] === newList[j-1][key] ? 0 : 1)

      let min = dp[i][j] = Math.min(insertion, deletion, replace)
      
      //存下每次的路径
      if (min === insertion) {
        map[`${i}||${j}`] = {
          type: 1,
          pre: `${i}||${j - 1}`,
          item: newList[j-1]
        }
      } else if (min === deletion) {
        map[`${i}||${j}`] = {
          type: -1,
          pre: `${i - 1}||${j}`
        }
      } else if (min === replace) {
        map[`${i}||${j}`] = {
          type: 0,
          pre: `${i - 1}||${j - 1}`,
          isEqual: oldList[i-1][key] === newList[j-1][key]
        }
      }
      //end
    }
  }
  
  // console.log(map)
  // 解析路径
  let k = len1
  let j = len2
  while (k > 0 && j >0) {
    let info = map[`${k}||${j}`]
    let move = {}
    move.type = info.type
    info.type === 1 ? move.index = k : move.index = k - 1
    if (info.type === 1) move.item = info.item
    if (info.type === 0)
      if (!info.isEqual) move.item = newList[j - 1]
      else {
        k = + info.pre.split('||')[0]
        j = + info.pre.split('||')[1]
        continue
      }
    moves.push(move)
    k = + info.pre.split('||')[0]
    j = + info.pre.split('||')[1]
  }
  //单独判断其中为0的可能
  if (k === 0 ^ j === 0) {
    if (k === 0) {
      while (j--) {
        let move = {}
        move.type = 1
        move.index = 0
        move.item = newList[0]
        moves.push(move)
      }
    } else if (j === 0) {
       while (k--) {
         let move = {}
         move.type = -1
         move.index = 0
         moves.push(move)
      }
    }
  }

  return {
    moves: moves,
    children: children
  }
}

function makeKeyIndexAndFree (list, key) {
  var keyIndex = {}
  var free = []
  for (var i = 0, len = list.length; i < len; i++) {
    var item = list[i]
    var itemKey = getItemKey(item, key)
    if (itemKey) {
      keyIndex[itemKey] = i
    } else {
      free.push(item)
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

// var oldList = [{id: "a"}, {id: "a"}, {id: "c"}]
// var newList = [{id: "c"}, {id: "a"}, {id: "c"}]

// var moves = diff(oldList, newList, "id")

// console.log(moves)

export default listDiff