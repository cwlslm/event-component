import Tree_node from "./tree_node.js"
import Structure_node from "./structure_node.js"

// 元素节点，与DOM元素一一对应，用于渲染DOM元素
export default class Element_node extends Tree_node{
  constructor(generator=null, childs=[], options={}) {
    super(childs)
    this.data = {}
    this.generator = null
    this.el = null
    this.s = null
    this.set_generator(generator)
    this.options = {}
    this.set_options(options)
    this.key = this.options.key
  }

  set_s(s) {
    if (!(s instanceof Structure_node)) {
      return -1
    }
    this.s = s
  }

  set_data(data) {
    if (!(data instanceof Object)) {
      return -1
    }
    this.data = data
  }

  set_generator(generator) {
    if (!(generator instanceof Function)) {
      return -1
    }
    this.generator = generator
  }

  set_options(options) {
    if (!(options instanceof Object)) {
      return -1
    }
    this.options = options
  }

  // 渲染DOM元素
  generate() {
    if (!this.generator) {
      return -1
    }

    let el_old = this.el
    this.el = this.generator()
    if (this.el) {
      this.el.$framework = {
        $framework: window.$franmework,
        el: this,
      }
      let list = [this.el]
      while (list.length) {
        let el = list.pop()
        for (let i=0; i<el.childNodes.length; i++) {
          el.childNodes[i].$framework = {
            $framework: window.$franmework,
            el_root: this,
          }
        }
        list.push(...el.childNodes)
      }
    }

    for (let i=0; i<this.childs.length; i++) {
      this.childs[i].el = null
    }
    for (let i=0; i<this.childs.length; i++) {
      this.childs[i].generate()
    }

    let comp = this.get_comp()
    if (this.options.ref_e === undefined) {
      comp = undefined
    }
    if (comp) {
      comp.refs_e[this.options.ref_e] = this
    }

    if (!el_old && this.el) {
      if (this.parent) {
        let next_node = this.next_node()
        while (1) {
          if (!next_node) {
            break
          }
          if (next_node.el) {
            break
          }
          next_node = next_node.next_node()
        }
        if (next_node) {
          this.parent.el.insertBefore(this.el, next_node.el)
        }
        else {
          this.parent.el.appendChild(this.el)
        }
      }
    }
    else if (el_old && !this.el) {
      el_old.remove()
    }
    else if (el_old && this.el) {
      el_old.replaceWith(this.el)
    }
  }

  set_el(el) {
    if (!(el instanceof Node) && el!==null) {
      return -1
    }
    this.el = el
  }

  // 移除一个元素节点，并在DOM中移除对应元素
  remove() {
    if (this.el) {
      this.el.remove()
    }
    let index = -1
    if (this.parent) {
      index = this.parent.remove_child(this)
    }
    return index
  }

  // 获取所属组件
  get_comp() {
    return this.s?.get_comp()
  }

  // 获取所属组件的根结构节点
  get_comp_s() {
    return this.s?.get_comp_s()
  }
}
