import Component from "../component.js"
import s from "../structure_node.js"
import e from "../element_node.js"

export default class Green_component extends Component {
  before_create() {
    console.log('green_component: before_create')
    this.data.list = []
    // 模拟请求
    setTimeout(() => {
      this.data.list = [
        'line1',
        'line2',
        'line3',
      ]
      this.generate().generate_all()
    }, 3000)
    return new s(function () {
      return [
        new e(function () {
          let el = document.createElement('div')
          el.style.backgroundColor = 'green'
          el.innerText = '加载中...'
          return el
        })
      ]
    })
  }

  created() {
    console.log('green_component: created')
  }

  before_mounted() {
    console.log('green_component: before_mounted')
  }

  mounted() {
    console.log('green_component: mounted')
  }

  destroy() {
    console.log('green_component: destroy')
  }

  generator() {
    let data = this.data
    let slot_content = this.slot.content

    // <div>
    //   <div v-html="slot_content"></div>
    //   <div v-if="init">
    //     <div v-for="text in list">{{text}}</div>
    //   </div>
    //   <div v-else>加载中...</div>
    // </div>

    return new s(function () {
      return [
        new e(function () {
          let el = document.createElement('div')
          el.style.backgroundColor = 'green'
          return el
        })
      ]
    }, [
      slot_content,
      new s(function () {
        return [
          new e(function () {
            return document.createElement('div')
          })
        ]
      }, [
        new s(function () {
          let els = []
          for (let i=0; i<data.list.length; i++) {
            els.push(new e(function () {
              let el = document.createElement('div')
              el.innerText = data.list[i]
              return el
            }))
          }
          return els
        })
      ])
    ])
  }
}
