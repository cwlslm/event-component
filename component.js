import Structure_node from "./structure_node.js"
import EventManager from "./event_maneger.js"

// 组件
export default class Component {
  // 组件生成器，必须用其生成组件，否则组件一旦生成将无法用generate函数进行刷新
  static Component_generator = class Component_generator {
    constructor(component, props, slot) {
      this.component = component
      this.props = props
      this.slot = slot
      this.comp = null
    }

    generate() {
      if (!Component.isPrototypeOf(this.component)) {
        return null
      }
      let comp = new this.component(this.props, this.slot, this)
      if (this.comp) {
        this.comp.s.replace_with(comp.s)
      }
      this.comp = comp
      return this.comp
    }
  }

  // props: 传入参数
  // slot: 插槽，Object中每一项的key为插槽名称，每一项的value为一个结构节点
  // evs: 传入的（将要注册的）事件
  // comp_generator: 生成器
  constructor(props={}, slot={}, evs={}, comp_generator) {
    this._props = props
    this._slot = slot
    this._evs = evs
    this._comp_generator = comp_generator
    this.data = {}
    this.is_created = false
    this.is_mounted = false
    this.props = {}
    this.set_props(props)
    this.slot = {}
    this.set_slot(slot)
    this.comp_generator = undefined
    this.set_comp_generator(comp_generator)
    this.ev = new EventManager()
    this.set_global_props()
    this.evs = {}
    this.set_evs()
    this.refs_e = {}
    this.refs_s = {}
    this.s = null
    let s = this.before_create()
    if (s === undefined) {
      this.generate()
    }
    else {
      if (!(s instanceof Structure_node)) {
        s = new Structure_node(function () { return [] })
      }
      if (!s.component_abstract) {
        s.options.component_root = this
        s.component_root = this
        s.component = this
      }
      this.s = s
    }
  }

  set_props(props=this._props) {
    if (props instanceof Function) {
      props = props()
    }
    if (!(props instanceof Object)) {
      return -1
    }
    this.props =props
  }

  set_slot(slot=this._slot) {
    if (slot instanceof Function) {
      slot = slot()
    }
    if (!(slot instanceof Object)) {
      return -1
    }

    let res = {}
    for (let key in slot) {
      if (!slot.hasOwnProperty(key)) {
        continue
      }
      if (slot[key] instanceof Structure_node) {
        res[key] = slot[key]
      }
    }
    this.slot = res
  }

  set_comp_generator(comp_generator=this._comp_generator) {
    if (!(comp_generator instanceof Component.Component_generator)) {
      return -1
    }
    this.comp_generator = comp_generator
  }

  set_global_props() {
    let props = window.$franmework?.global_props
    if (props) {
      for (let key in props) {
        if (!props.hasOwnProperty(key) || this[key] !== undefined) {
          continue
        }
        this[key] = props[key]
      }
    }
  }

  set_evs() {
    if (!(this._evs instanceof Object)) {
      this._evs = {}
    }
    for (let key in this._evs) {
      if (!this._evs.hasOwnProperty(key) || !(this._evs[key] instanceof Function)) {
        continue
      }
      this.evs[key] = this._evs[key]
      this.ev.add(key, this.evs[key])
    }
  }

  generator() {
    return null
  }

  // 生成结构节点
  generate() {
    this.set_props()
    this.set_slot()
    if (this.is_created) {
      this.before_update()
    }
    // 向下传递component
    let s = this.generator()
    if (!s.component_abstract) {
      s.options.component_root = this
      s.component_root = this
      s.component = this
      let list = [s]
      while (list.length) {
        let item = list.pop()
        for (let i=0; i<item.childs.length; i++) {
          let child = item.childs[i]
          if (item.component && !child.component) {
            child.component = item.component
            list.push(child)
          }
        }
      }
      // 处理refs_s
      list = [s]
      while (list.length) {
        let item = list.pop()
        if (item.options.ref_s) {
          this.refs_s[item.options.ref_s] = item
        }
        for (let i=0; i<item.childs.length; i++) {
          let child = item.childs[i]
          if (child.component !== s.component) {
            continue
          }
          list.push(child)
        }
      }
    }
    if (this.s && this.s.component_abstract) {
      if (!s.component_abstract && this.s.component_abstract.s === this.s) {
        this.s.component_abstract.s = s
      }
      s.component_abstract = this.s.component_abstract
      s.component_abstract_type = this.s.component_abstract_type
    }
    if (!this.s) {
      this.s = s
    }
    else {
      this.s.replace_with(s)
      this.s = s
    }
    if (!this.is_created) {
      this.created()
      this.is_created = true
    }
    else {
      this.updated()
    }
    return s
  }

  before_create() {
    // 结构树未生成
  }

  created() {
    // 结构树已生成，元素树未生成
  }

  before_mounted() {
    // 元素树已生成，元素未生成
  }

  mounted() {
    // 元素已生成并已挂载到dom
  }

  before_update() {
    // （调用组件的generate函数）触发更新前（组件创建时不调用），旧元素未移除，新元素未生成
  }

  updated() {
    // （调用组件的generate函数）触发更新后（组件创建时不调用），旧元素已被替换
  }

  destroy() {
    // 销毁前调用
  }
}
