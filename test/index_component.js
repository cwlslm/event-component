import Component from "../component.js"
import s from "../structure_node.js"
import e from "../element_node.js"
import Item from "./item_list_component.js"
import Components from "../components.js"
import Red_component from "./red_component.js"
import Green_component from "./green_component.js"
import If_comp from "../if_comp.js"

export default class Index_component extends Component {
  before_create() {
    this.data = {
      title: 'This is Title',
      text_list: [
        'item - 1',
        'item - 2',
        'item - 3',
      ],
      color_type: 0,
      color_components: [Red_component, Green_component],
      switch_status: true,
      footer: 'This is Footer',
    }
  }

  generator() {
    let data = this.data

    // 伪html代码，参考vue的语法
    // <div>
    //   <h2>{{ title }}</h2>
    //   <div>
    //     <input class="add-input" ref="el_input" />
    //     <button @click="data.text_list.push($refs.el_input.value);s_item.generate_all()">添加</button>
    //   </div>
    //   <item :list="text_list">
    //     <template slot-right="scope">
    //       <el-button @click="text_list.splice(scope.index, 1)">删除{{ scope.index }}</el-button>
    //     </template>
    //   </item>
    //   <button @click="color_type=color_type?0:1">动态组件：切换</button>
    //   <button @click="">重新加载动态组件</button>
    //   <components :is="color_components[color_type]"></components>
    //   <h2>{{ footer }}</h2>
    // </div>

    // 根节点
    let s_root = new s(function () {
      return [
        new e(function () {
          return document.createElement('div')
        })
      ]
    })

    // 标题
    let s_title = new s(function () {
      return [
        new e(function () {
          let el = document.createElement('h2')
          el.innerText = data.title
          return el
        })
      ]
    })
    s_root.append_child(s_title)

    // 添加功能（一个input一个button）
    let s_add = new s(function () {
      return [
        new e(function () {
          return document.createElement('div')
        })
      ]
    }, [
      new s(function () {
        return [
          new e(function () {
            let el = document.createElement('input')
            el.className = 'add-input'
            return el
          })
        ]
      }),
      new s(function () {
        return [
          new e(function () {
            let el = document.createElement('button')
            el.innerText = '添加'
            el.onclick = () => {
              let el_input = this.get_comp_s().query_selector('.add-input')
              if (el_input) {
                // data.text_list.push(el_input.value)
                // item_comp_generator.comp.s.generate_all()            // 重新生成元素节点并渲染
                // item_comp_generator.comp.generate().generate_all()   // 重新生成结构节点并渲染（保留组件数据）
                // item_comp_generator.comp.s.generate_all(true) // 重新生成结构节点并渲染（不保留组件数据）

                item_comp_generator.comp.ev.commit('add', el_input.value) // 通过向组件发送事件，触发组件内部更新
                console.log(this.get_comp().refs_e['test'])
              }
            }
            return el
          }, [], {ref_e: 'test'})
        ]
      }),
    ])
    s_root.append_child(s_add)

    // Item_list组件
    let item_comp_generator = new Component.Component_generator(Item, {
      data: data.text_list
    }, function () {
      return {
        right: new s(function (pe_data) {
          return [
            new e(function () {
              let el = document.createElement('button')
              el.innerText = `删除“${pe_data.value}”`
              el.onclick = () => {
                let index = data.text_list.findIndex(value => value === pe_data.value)
                data.text_list.splice(index, 1)
                // item_comp_generator.comp.generate().generate_all()
                item_comp_generator.comp.ev.commit('del', pe_data.value)
              }
              return el
            })
          ]
        })
      }
    })
    s_root.append_child(item_comp_generator.generate().s)

    // 切换按钮
    let s_button_switch = new s(function () {
      return [
        new e(function () {
          let el = document.createElement('button')
          el.innerText = '动态组件：切换'
          el.onclick = function () {
            data.color_type = data.color_type ? 0 : 1
            components_comp_generator.comp.generate()
            components_comp_generator.comp.s.generate_all()
          }
          return el
        })
      ]
    })
    s_root.append_child(s_button_switch)

    // 刷新按钮
    let s_button_refresh = new s(function () {
      return [
        new e(function () {
          let el = document.createElement('button')
          el.innerText = '重新加载动态组件'
          el.onclick = function () {
            components_comp_generator.generate()
            components_comp_generator.comp.s.generate_all()
          }
          return el
        })
      ]
    })
    s_root.append_child(s_button_refresh)

    // 动态组件
    let components_comp_generator = new Component.Component_generator(Components, function () {
      return {
        keep_alive: true,
        component: data.color_components[data.color_type],
        props: {},
        slot: {
          content: new s(function () {
            return [
              new e(function () {
                let el = document.createElement('text')
                el.innerText = `${['红色','绿色'][data.color_type]}背景！`
                return el
              })]
          })
        }
      }
    })
    s_root.append_child(components_comp_generator.generate().s)

    // 开关切换按钮
    let s_switchBtn = new s(function () {
      return [
        new e(function () {
          let el = document.createElement('button')
          el.innerText = data.switch_status ? '关' : '开'
          el.onclick = function () {
            data.switch_status = !data.switch_status
            el.innerText = data.switch_status ? '关' : '开'
            s_content_if_comp_generator.comp.update()
          }
          return el
        })
      ]
    })
    s_root.append_child(s_switchBtn)

    // 内容
    let s_content_generator = function () {
      return new s(function () {
        return [
          new e(function () {
            let el = document.createElement('div')
            el.style.background = 'rgba(0, 0, 100, 0.5)'
            el.style.height = '50px'
            el.innerText = '你好呀'
            return el
          })
        ]
      })
    }
    let s_content_if_comp_generator = new Component.Component_generator(If_comp, function () {
      return {
        generator: s_content_generator,
        condition: data.switch_status,
      }
    })
    s_root.append_child(s_content_if_comp_generator.generate().s)

    // 页脚
    let s_footer = new s(function () {
      return [
        new e(function () {
          let el = document.createElement('h2')
          el.innerText = data.footer
          return el
        })
      ]
    })
    s_root.append_child(s_footer)

    return s_root
  }
}
