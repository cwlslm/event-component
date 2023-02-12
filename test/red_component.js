import Component from "../component.js"
import s from "../structure_node.js"
import e from "../element_node.js"

export default class Red_component extends Component {
  generator() {
    let slot_content = this.slot.content

    // <div>
    //   <div v-html="slot_content"></div>
    // </div>

    return new s(function () {
      return [
        new e(function () {
          let el = document.createElement('div')
          el.style.backgroundColor = 'red'
          return el
        })
      ]
    }, [slot_content])
  }
}
