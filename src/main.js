
import Vue from 'vue'
import App from './App'
import router from './router'
import store from "@/store"
import { Input,Button,Tabs,TabPane,Pagination,Drawer,Carousel,CarouselItem,Message,Tag,Scrollbar,Table,TableColumn,Slider} from 'element-ui';
// 在调用 Vue.use 前，给 Message 添加 install 方法


// Drawer.props.lockScroll = false;
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
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Slider)
Vue.use(Drawer)


Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.filter('playTimeFormat', function (originVal) {
  let duration = originVal
  let min = parseInt(duration / 1000 / 60)
  if (min < 10) {
    min = '0' + min
  }
  let sec = parseInt((duration / 1000) % 60)
  if (sec < 10) {
    sec = '0' + sec
  }
  return `${min}:${sec}`
})

// 公共样式
import "@/assets/icon/iconfont.css";


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
