import Component from "./component.js"

// 框架初始化，启动，入口
export default class Framework {
  // comp_generator: 根组件的生成器
  // el: 入口DOM元素
  // router: 路由
  constructor(comp_generator, el, router) {
    if (!(comp_generator instanceof Component.Component_generator) || !(el instanceof Element)) {
      return
    }
    window.$franmework = this
    let global_props = {
      $framework: this
    }
    if (router) {
      global_props['$router'] = router
    }
    this.global_props = global_props
    this.root_comp_g = comp_generator.generate()
    this.root_comp_g.s.generate_all()
    el.replaceWith(this.root_comp_g.s.els[0].el)
  }
}
