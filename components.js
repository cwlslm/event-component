import Component from "./component.js"

// 动态组件
export default class Components extends Component {
  before_create() {
    this.data.keep_alive = this.props.keep_alive
    this.data.comp_generator_now = undefined
    this.data.comp_generator_list = []
  }

  destroy() {
    if (this.data.keep_alive) {
      for (let i=0; i<this.data.keep_alive.length; i++) {
        this.data.keep_alive[i].destroy()
      }
    }
    else {
      this.data.comp_generator_now.comp.destroy()
    }
  }

  generator() {
    let props = this.props
    let comp_generator
    if (this.data.keep_alive) {
      comp_generator = this.data.comp_generator_list.find(item => item.comp.constructor === props.component)
    }
    else if (this.data.comp_generator_now) {
      this.data.comp_generator_now.comp.destroy()
    }
    if (!comp_generator) {
      let comp_generator_new = new Component.Component_generator(props.component, props.props, props.slot)
      let comp = comp_generator_new.generate()
      if (!comp) {
        return null
      }
      comp_generator = comp_generator_new
      if (this.data.keep_alive) {
        this.data.comp_generator_list.push(comp_generator)
      }
    }
    this.data.comp_generator_now = comp_generator
    comp_generator.comp.s.component_abstract = this
    comp_generator.comp.s.component_abstract_type = Components
    return comp_generator.comp.s
  }
}
