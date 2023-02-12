// 事件管理器
export default class EventManager {
  constructor() {
    this.data = {}
  }

  add(event_name, cb) {
    if (!this.data[event_name]) {
      this.data[event_name] = []
    }
    this.data[event_name].push(cb)
  }

  remove(event_name, cb=undefined, deep=false) {
    if (!this.data[event_name]) {
      return -1
    }
    if (!cb) {
      delete this.data[event_name]
    }
    else {
      let index = this.data[event_name].indexOf(cb)
      if (index !== -1) {
        this.data[event_name].splice(index, 1)
      }
      if (deep) {
        let index = this.data[event_name].indexOf(cb)
        while (index) {
          this.data[event_name].splice(index, 1)
          index = this.data[event_name].indexOf(cb)
        }
      }
    }
  }

  commit(event_name, data=undefined) {
    if (!this.data[event_name]) {
      return -1
    }
    for (let i=0; i<this.data[event_name].length; i++) {
      this.data[event_name][i](data)
    }
  }
}
