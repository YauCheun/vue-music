
import Vue from 'vue'
import App from './App'
import router from './router'
import { Input,Button,Tabs,TabPane,Carousel,CarouselItem,Message,Tag,Scrollbar } from 'element-ui';
// 在调用 Vue.use 前，给 Message 添加 install 方法
Message.install = function (Vue) {
  Vue.prototype.$message = Message
}
Vue.use(Input)
Vue.use(Button)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Message)
Vue.use(Tag)
Vue.use(Scrollbar)



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
