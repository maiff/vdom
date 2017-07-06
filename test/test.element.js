import el from '../src/Element'
import diff from '../src/diff'
  var tree = el('div', {'id': 'container'}, [
    el('p', ['the count is :' + 1])
  ])
  var newTree = el('div', {'id': 'container'}, [
    el('h3', {style: 'color: blue', key: 'te'}, ['simple virtal dom2']),
    el('p', ['the count is :' + 1])
  ])
console.log(
 
)
tree =    [
    {
        "tagName": "tr", 
        "props": {
            "key": "user1"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user1"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Jerry"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "12"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "200"
                ], 
                "count": 1
            }
        ], 
        "key": "user1", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user4"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user4"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Pony"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "33"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "3000"
                ], 
                "count": 1
            }
        ], 
        "key": "user4", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user2"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user2"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Lucy"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "21"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "99"
                ], 
                "count": 1
            }
        ], 
        "key": "user2", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user3"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user3"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Tomy"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "20"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "20"
                ], 
                "count": 1
            }
        ], 
        "key": "user3", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user5"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user5"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Funky"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "49"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "521"
                ], 
                "count": 1
            }
        ], 
        "key": "user5", 
        "count": 8
    }
]
newTree = [
    {
        "tagName": "tr", 
        "props": {
            "key": "user5"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user5"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Funky"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "49"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "521"
                ], 
                "count": 1
            }
        ], 
        "key": "user5", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user4"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user4"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Pony"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "33"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "3000"
                ], 
                "count": 1
            }
        ], 
        "key": "user4", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user2"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user2"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Lucy"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "21"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "99"
                ], 
                "count": 1
            }
        ], 
        "key": "user2", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user3"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user3"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Tomy"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "20"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "20"
                ], 
                "count": 1
            }
        ], 
        "key": "user3", 
        "count": 8
    }, 
    {
        "tagName": "tr", 
        "props": {
            "key": "user1"
        }, 
        "children": [
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "user1"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "Jerry"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "12"
                ], 
                "count": 1
            }, 
            {
                "tagName": "td", 
                "props": { }, 
                "children": [
                    "200"
                ], 
                "count": 1
            }
        ], 
        "key": "user1", 
        "count": 8
    }
]

console.log(JSON.stringify(diff(tree, newTree)))