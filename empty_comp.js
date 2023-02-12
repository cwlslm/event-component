import Component from "./component.js"
import s from "./structure_node.js"

export default class Empty_comp extends Component {
  generator() {
    return new s(function () {
      return []
    })
  }
}
