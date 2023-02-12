import Tree_node from "./tree_node.js"
import Element_node from "./element_node.js"

// 结构节点，描述html元素的结构关系，用于生成对应的元素节点
export default class Structure_node extends Tree_node {
  constructor(generator=null, childs=[], options={}) {
    super()
    this.data = {}
    this.generator = null
    this.set_generator(generator)
    this.els = []
    this.options = {}
    this.set_options(options)
    this.component = null
    this.component_root = null
    this.component_abstract = null
    this.component_abstract_type = null
    if (childs instanceof Array) {
      for (let i=0; i<childs.length; i++) {
        this.append_child(childs[i])
      }
    }
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

  append_child(child, index=undefined) {
    super.append_child(child, index)
    if (!child.component) {
      child.component = this.component
    }
  }

  // 把父级元素节点的数据（合并）添加到其子元素节点上，向下传递数据
  static set_els_data(els, pe_data) {
    if (!(els instanceof Array)) {
      return -1
    }
    if (!(pe_data instanceof Object)) {
      pe_data = {}
    }
    for (let i=0; i<els.length; i++) {
      let el = els[i]
      if (!(el.data instanceof Object)) {
        el.data = {}
      }
      for (let key in pe_data) {
        if (!pe_data.hasOwnProperty(key) || el.data[key] !== undefined) {
          continue
        }
        el.data[key] = pe_data[key]
      }
    }
  }

  // 生成'本结构节点及其下的子结构节点'的元素节点
  _generate() {
    if (!this.generator) {
      return -1
    }

    for (let i=0; i<this.els.length; i++) {
      this.els[i].remove()
    }
    this.els = []
    for (let i=0; i<this.childs.length; i++) {
      this.childs[i].els = []
    }

    if (this.parent) {
      // 父级节点的所有元素（此子节点的元素需要分别在每个'父级节点的元素'下生成）
      let p_els = [...this.parent.els]
      // 'p_els'中所有元素的初始序号
      let p_els_init_index = p_els.map(((value, index) => index))
      // 对'this.els'进行排序的中间数据
      let els_sort_data = []
      // 在父级节点下，此子节点的序号
      let index = this.parent.childs.indexOf(this)
      // 在父级节点下，此子节点的后方节点列表
      let after_nodes = []
      if (index !== -1) {
        after_nodes = [...this.parent.childs].splice(index+1)
      }
      // 遍历后方节点
      for (let i=0; i<after_nodes.length; i++) {
        // 遍历此后方节点的元素
        for (let j=0; j<after_nodes[i].els.length; j++) {
          // 计算此'后方节点的元素'所属的'父级节点的元素'
          // 'p_els_index'为'-1'的情况是此'后方节点的元素'所属的'父级节点的元素'已处理完成并已被移除出'p_els'
          let p_els_index = p_els.indexOf(after_nodes[i].els[j].parent)
          if (p_els_index !== -1) {
            // 在此'父级节点的元素'的子元素中定位成功，生成对应的元素节点列表并插入到定位处
            // 同时将其保存在‘this.els’中（此时列表中的元素未正确排序）
            // 本子节点在此'父级节点的元素'下的生成已完成，在'p_els'中删除此'父级节点的元素'
            // 对'this.els'进行排序的中间处理
            let pe_data = p_els[p_els_index].data
            let els = this.generator(pe_data)
            Structure_node.set_els_data(els, pe_data)
            after_nodes[i].els[j].insert_before_with(els)
            this.els.push(...els)
            p_els.splice(p_els_index, 1)
            let init_index = p_els_init_index.splice(p_els_index, 1)[0]
            els_sort_data.push([init_index, this.els.length - els.length, this.els.length])
          }
        }
      }
      // 遍历'父级节点的所有元素中，本子节点的元素尚未生成的'
      // 在这些'父级节点的元素'的子元素中，未找到有'本子节点的后方节点'的元素存在
      // 所以'本子节点'在这些'父级的元素'下将要生成的子元素直接定位到这些'父级的元素'内部的末尾
      // 对'this.els'进行排序的中间处理
      for (let i=0; i<p_els.length; i++) {
        let pe_data = p_els[i].data
        let els = this.generator(pe_data)
        Structure_node.set_els_data(els, pe_data)
        for (let j=0; j<els.length; j++) {
          p_els[i].append_child(els[j])
        }
        this.els.push(...els)
        let init_index = p_els_init_index[i]
        els_sort_data.push([init_index, this.els.length - els.length, this.els.length])
      }
      // 对'this.els'进行排序
      // 若'节点的元素'未设置'key'，则将其'key'设置为其在'父级节点的元素'下的序号
      let els = []
      els_sort_data.sort((item0, item1) => item0[0] - item1[0])
      for (let i=0; i<els_sort_data.length; i++) {
        let start_index = els_sort_data[i][1]
        let end_index = els_sort_data[i][2]
        for (let j=start_index; j<end_index; j++) {
          if (this.els[j].key === undefined) {
            this.els[j].key = j - start_index
          }
        }
        els.push(...this.els.slice(start_index, end_index))
      }
      this.els = els
    }
    else {
      this.els = this.generator(null)
    }

    for (let i=0; i<this.els.length; i++) {
      this.els[i].s = this
    }

    if (this.component_abstract && this.component_abstract.is_created && !this.component_abstract.is_mounted) {
      this.component_abstract.before_mounted()
    }
    if (this.component_root && this.component_root.is_created && !this.component_root.is_mounted) {
      this.component_root.before_mounted()
    }

    for (let i=0; i<this.childs.length; i++) {
      this.childs[i]._generate()
    }
  }

  // 重新加载本结构节点下的所有组件
  rebuild() {
    let list = [this]
    while (list.length) {
      let s_item = list.pop()
      if (s_item.component_root && s_item.component_root.comp_generator) {
        let childs = [...s_item.childs]
        while(childs.length) {
          let child_item = childs.pop()
          if (child_item.component_root) {
            if (child_item.component_abstract) {
              child_item.component_abstract.destroy()
            }
            else {
              child_item.component_root.destroy()
            }
          }
          childs.push(...child_item.childs)
        }
        if (s_item.component_abstract) {
          s_item.component_abstract.destroy()
        }
        else {
          s_item.component_root.destroy()
        }
        let new_comp = s_item.component_root.comp_generator.generate()
        s_item.replace_with(new_comp.s)
        if (s_item === this) {
          return new_comp.s
        }
      }
      else {
        list.push(...s_item.childs)
      }
    }
    return this
  }

  // 生成'本结构节点及其下的子结构节点'的元素节点并渲染
  // 'rebuild'为'true'时重新加载本结构节点下的所有组件
  generate(rebuild=false) {
    let _this = this
    if (rebuild) {
      _this = this.rebuild()
    }
    _this._generate()
    return _this
  }

  /**
   * 通过元素节点的key来指定本结构节点下要更新的元素节点
   * @param {any[]} keys - key列表
   */
  update_by_keys(keys) {
    if (!this.parent || !keys.length) {
      return
    }
    // 把本级元素节点（即this.els）按父级元素节点（即this.parent.els）分组
    let p_els_data = this.parent.els.map(el => {
      return {
        p_el: el,
        els: [],
      }
    })
    // 找到每个本级元素节点对应的父级元素节点
    for (let i=0; i<this.els.length; i++) {
      let index = this.parent.els.findIndex(p_el => this.els[i].parent === p_el)
      if (index !== -1) {
        p_els_data[index].els.push(this.els[i])
      }
    }
    let els_startIndex = 0
    for (let i=0; i<p_els_data.length; i++) {
      // 若现有元素节点中已存在对应key的元素，则删除
      for (let j=0; j<keys.length; j++) {
        let key = keys[j]
        let index_in_els = p_els_data[i].els.findIndex(el => el.key === key)
        if (index_in_els !== -1) {
          p_els_data[i].els[index_in_els].s.remove_el(p_els_data[i].els[index_in_els])
          p_els_data[i].els[index_in_els].remove()
          p_els_data[i].els.splice(index_in_els, 1)
        }
      }
      // 生成新元素节点
      let pe_data = p_els_data[i].p_el.data
      let els_new = this.generator(pe_data)
      Structure_node.set_els_data(els_new, pe_data)
      for (let j=0; j<els_new.length; j++) {
        if (els_new[j].key === undefined) {
          els_new[j].key = j
        }
      }
      // 找出新生成的元素节点中对应key的元素，并按index（而不是keys的顺序）排序
      let elsNew_data = []
      for (let j=0; j<keys.length; j++) {
        let key = keys[j]
        let index_in_elsNew = els_new.findIndex(el => el.key === key)
        if (index_in_elsNew !== -1) {
          elsNew_data.push({ index: index_in_elsNew, el: els_new[index_in_elsNew] })
        }
      }
      elsNew_data.sort((item0, item1) => item0.index - item1.index)
      // 按顺序添加
      for (let j=0; j<elsNew_data.length; j++) {
        let index_in_elsNew = elsNew_data[j].index
        let el_new = elsNew_data[j].el
        if (index_in_elsNew > p_els_data[i].els.length) {
          index_in_elsNew = p_els_data[i].els.length
        }
        // 添加新元素节点
        p_els_data[i].p_el.append_child(el_new, index_in_elsNew)
        p_els_data[i].els.splice(index_in_elsNew, 0, el_new)
        let index = els_startIndex + index_in_elsNew
        this.els.splice(index, 0, el_new)
        el_new.s = this

        // 从上面添加的新元素节点开始，向下生成所有子元素节点并添加
        // 记录新增的元素节点及其对应的结构节点的子节点
        let list = [{p_els: [el_new], s_list: [...this.childs]}]
        while (list.length) {
          let item = list.pop()
          let p_els = item.p_els
          let s_list = item.s_list
          for (let k=0; k<p_els.length; k++) {
            let p_el = p_els[k]
            for (let l=0; l<s_list.length; l++) {
              let s_node = s_list[l]
              let els = s_node.generator(p_el.data)
              Structure_node.set_els_data(els, p_el.data)
              for (let m=0; m<els.length; m++) {
                if (els[m].key === undefined) {
                  els[m].key = m
                }
                els[m].s = s_node
                p_el.append_child(els[m])
              }
              let next_node = p_el.next_node()
              let next_el = undefined
              while (1) {
                if (!next_node) {
                  break
                }
                next_el = next_node.childs.find(el => el.s === s_node)
                if (next_el) {
                  break
                }
                next_node = next_node.next_node()
              }
              if (!next_node) {
                s_node.els.push(...els)
              }
              else {
                next_el.insert_before_with(...els)
              }
              list.push({p_els: [...els], s_list: [...s_node.childs]})
            }
          }
        }
        // 渲染新元素节点
        el_new.generate()
      }
      els_startIndex += p_els_data[i].els.length
    }
  }

  // 移除本结构节点及其对应的元素节点
  remove() {
    if (this.parent) {
      this.parent.remove_child(this)
    }
    for (let i=0; i<this.els.length; i++) {
      this.els[i].remove()
    }
  }

  // 用一个结构节点替换本结构节点，并移除本结构节点对应的元素节点
  replace_with(new_s) {
    if (!(new_s instanceof Structure_node)) {
      return -1
    }
    if (super.replace_with(new_s) <= -1) {
      return -2
    }
    for (let i=0; i<this.els.length; i++) {
      this.els[i].remove()
    }
  }

  set_els(els) {
    if (!(els instanceof Array)) {
      return -1
    }
    this.els = []
    for (let i=0; i<els.length; i++) {
      let el = els[i]
      if (el instanceof Element_node) {
        this.els.push(el)
      }
    }
  }

  // 移除本结构节点对应的元素节点中的一个（DOM中保留被移除元素，不重新渲染）
  remove_el(el) {
    let index = this.els.indexOf(el)
    if (index === -1) {
      return -1
    }
    this.els.splice(index, 1)
    el.s = null
  }

  // 对本结构节点对应的元素节点进行渲染
  generate_els() {
    for (let i=0; i<this.els.length; i++) {
      this.els[i].generate()
    }

    let list = [this]
    while(list.length) {
      let item = list.pop()
      if (item.component_abstract && item.component_abstract.is_created && !item.component_abstract.is_mounted) {
        item.component_abstract.mounted()
        item.component_abstract.is_mounted = true
      }
      if (item.component_root && item.component_root.is_created && !item.component_root.is_mounted) {
        item.component_root.mounted()
        item.component_root.is_mounted = true
      }
      list.push(...item.childs)
    }
  }

  // 生成'本结构节点及其下的子结构节点'的元素节点并渲染
  // 'rebuild'为'true'时重新加载本结构节点下的所有组件
  generate_all(rebuild=false) {
    let _this = this.generate(rebuild)
    _this.generate_els()
    return _this
  }

  // 获取所属组件
  get_comp() {
    return this.component
  }

  // 获取所属组件的根结构节点
  get_comp_s() {
    return this.component?.s
  }

  /**
   * 封装document.querySelectorAll
   * @param {String} selectors
   * @returns {Element[]}
   */
  query_selector_all(selectors) {
    let res = []
    for (let i=0; i<this.els.length; i++) {
      let el = this.els[i]
      if (el && el.el) {
        res.push(...el.el.querySelectorAll(selectors))
      }
    }
    return res
  }

  /**
   * 封装document.querySelector
   * @param {String} selectors
   * @returns {Element}
   */
  query_selector(selectors) {
    let res = this.query_selector_all(selectors)
    if (res.length) {
      return res[0]
    }
    return null
  }
}
