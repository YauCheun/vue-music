import axios from 'axios'
import qs from 'qs'

axios.defaults.baseURL = 'http://catbk.cn:3000'
axios.defaults.withCredentials = true
axios.defaults.crossDomain = true
// axios.interceptors.request.use(config => {
//   config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
//   if (config.method === 'post') {
//     config.data = qs.stringify({
//       ...config.data
//     })
//   }
//   return config;
// })
export default {
  //轮播图
  getBanner:(data)=>axios.post('/banner',qs.stringify(data)),
  //推荐歌单
  getRecommend:(data)=>axios.post('/personalized',qs.stringify(data)),
  //独家放送
  getPrivatecontent:()=>axios.post('/personalized/privatecontent'),
  //最新单曲
  getNewSong:()=>axios.post('/personalized/newsong'),
  //推荐mv
  getRecommendMv:()=>axios.post('/personalized/mv')
}
