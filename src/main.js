
import Vue from 'vue'
import App from './App'
import router from './router'
import { Input,Button,Tabs,TabPane } from 'element-ui';
Vue.use(Input)
Vue.use(Button)
// Vue.use(Tabs)
// Vue.use(TabPane)

// 公共样式
import "@/assets/icon/iconfont.css";


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
