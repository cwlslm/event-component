import Component from "./component.js"
import s from "./structure_node.js"

// 对结构节点使用的if组件（对组件用的if实现可通过动态组件components）
export default class If_comp extends Component {
  before_create() {
    this.data.generator_default = function () {
      return new s(function () {
        return []
      })
    }
    this.data.generator = this.data.generator_default
    if (this.props.generator instanceof Function) {
      this.data.generator = this.props.generator
    }
    this.data.condition = this.props.condition
    this.data.keep_alive = this.props.keep_alive
    this.data.s = null
  }

  update() {
    this.set_props()
    let condition = this.props.condition
    if (condition !== this.data.condition) {
      this.data.condition = condition
      this.generate().generate_all()
    }
  }

  generator() {
    let s
    if (this.data.condition) {
      if (this.data.keep_alive && this.data.s) {
        s = this.data.s
      }
      else {
        s = this.data.generator()
        if (this.data.keep_alive) {
          this.data.s = s
        }
      }
    }
    else {
      s = this.data.generator_default()
    }
    if (!s) {
      s = this.data.generator_default()
    }
    return s
  }
}
