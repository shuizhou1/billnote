// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store'
import App from './App'
import router from './router'
import vant from 'vant'
import 'vant/lib/vant-css/index.css' // 移动UI插件
import 'font-awesome/css/font-awesome.min.css'
import 'mint-ui/lib/style.min.css'
import axios from 'axios'
import echarts from 'echarts' // 图表插件

Vue.use(vant)
Vue.prototype.$http = axios
// 注册全局指令v-focus
Vue.directive('focus', {
// 元素插入到dom中时调用(inserted)  
  inserted (el) {
    el.focus()
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
