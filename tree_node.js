// 树节点（数据结构）
export default class Tree_node {
  constructor(childs=[]) {
    this.parent = null
    this.childs = []

    if (!(childs instanceof Array)) {
      return -1
    }
    for (let i=0; i<childs.length; i++) {
      this.append_child(childs[i])
    }
  }

  // 在本节点下插入子节点
  append_child(child, index=undefined) {
    if (!(child instanceof Tree_node)) {
      return -1
    }
    if (child.parent) {
      return -2
    }
    if (this.childs.indexOf(child) !== -1) {
      return -3
    }
    child.parent = this
    if (!index) {
      this.childs.push(child)
    }
    else if (Number.isInteger(index) && index>=0) {
      this.childs.splice(index, 0, child)
    }
  }

  // 在本节点前插入若干节点
  insert_before_with(items) {
    if (!(items instanceof Array)) {
      return -1
    }
    if (!this.parent) {
      return -2
    }
    let index = this.parent.childs.indexOf(this)
    if (index === -1) {
      return -3
    }
    for (let i=0; i<items.length; i++) {
      items[i].parent = this.parent
    }
    this.parent.childs.splice(index, 0, ...items)
  }

  // 在本节点后插入若干节点
  insert_after_with(items) {
    if (!(items instanceof Array)) {
      return -1
    }
    if (!this.parent) {
      return -2
    }
    let index = this.parent.childs.indexOf(this)
    if (index === -1) {
      return -3
    }
    for (let i=0; i<items.length; i++) {
      items[i].parent = this.parent
    }
    this.parent.childs.splice(index+1, 0, ...items)
  }

  // 移除本节点下的一个子节点
  remove_child(child) {
    let index = this.childs.indexOf(child)
    if (index === -1) {
      return -1
    }
    this.childs.splice(index, 1)
    child.parent = null
    return index
  }

  // 用一个节点替代本节点
  replace_with(new_node) {
    if (!(new_node instanceof Tree_node)) {
      return -1
    }
    if (!this.parent) {
      return -2
    }
    let parent = this.parent
    let index = this.parent.remove_child(this)
    if (index <= -1) {
      return -3
    }
    parent.append_child(new_node, index)
  }

  // 获取本节点的上一个节点
  last_node() {
    if (!this.parent) {
      return null
    }
    let index = this.parent.childs.indexOf(this)
    if (index===-1 || index===0) {
      return null
    }
    return this.parent.childs[index-1]
  }

  // 获取本节点的下一个节点
  next_node() {
    if (!this.parent) {
      return null
    }
    let index = this.parent.childs.indexOf(this)
    if (index===-1 || index===this.parent.childs.length-1) {
      return null
    }
    return this.parent.childs[index+1]
  }
}
