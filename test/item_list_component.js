import Component from "../component.js"
import s from "../structure_node.js"
import e from "../element_node.js"

export default class Item_list_component extends Component {
  before_create() {
    this.data.list = []
    if (this.props.data instanceof Array) {
      this.data.list = [...this.props.data]
    }
  }

  created() {
    this.ev.add('add', key => {
      let index = this.data.list.findIndex(value => value === key)
      if (index === -1) {
        this.data.list.push(key)
        this.refs_s.list.update_by_keys([key])
      }
    })
    this.ev.add('del', key => {
      let index = this.data.list.findIndex(value => value === key)
      if (index !== -1) {
        this.data.list.splice(index, 1)
        this.refs_s.list.update_by_keys([key])
      }
    })
  }

  generator() {
    let list = this.data.list
    let slot_right = this.slot.right

    // <div>
    //   <div v-for="(text, index) in list">
    //     <text>{{ text }}</text>
    //     <div v-html="slot.right"></div>
    //   </div>
    // </div>

    return new s(function () {
      return [
        new e(function () {
          return document.createElement('div')
        })
      ]
    }, [
      new s(function () {
        let els = []
        for (let i=0; i<list.length; i++) {
          let el = new e(function () {
            return document.createElement('div')
          }, [], {key: list[i]})
          el.data.value = list[i]
          els.push(el)
        }
        return els
      }, [
        new s(function (pe_data) {
          return [
            new e(function () {
              let el = document.createElement('text')
              el.innerText = pe_data.value
              return el
            })
          ]
        }),
        new s(function () {
          return [
            new e(function () {
              let el = document.createElement('div')
              el.style.display = 'inline-block'
              return el
            })
          ]
        }, [
          slot_right
        ]),
      ], { ref_s: 'list' })
    ])
  }
}
