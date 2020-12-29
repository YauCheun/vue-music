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
  getRecommendMv:()=>axios.post('/personalized/mv'),
  //获取歌单详情/playlist/detail
  getDetailList:(data)=>axios.post('/playlist/detail?id='+data),
  // 获取歌单评论
  getPlaylistComments:(data)=>axios.post('/comment/playlist',qs.stringify(data)),
  // 获取歌曲详情
  GetSongDetail:(data)=>axios.post('/song/detail',qs.stringify(data)),
  // 获取歌曲url
  GetSongUrl:(id)=>axios.post('/song/url?id='+id+'&br=999000'),
  //获取歌词
  getLyric:(id)=>axios.post('/lyric',qs.stringify(id)),
  // 获取歌曲评论
  getMusicComments:(data)=>axios.post('/comment/music',qs.stringify(data)),
  // 获取MV播放地址
  getMvUrl:(param)=> axios.post(`/mv/url`, param),
  // 获取MV详情
  getMvDetail:(param) => axios.post(`/mv/detail`, param),
  // 获取歌手头像
  getArtistIcon:(param) =>axios.post('/artists', param),
  // 获取MV评论
  getMvComment:(id, param)=>axios.post('/comment/mv', param),
  // 获取相关MV
  getSimiMvUrl:(param) =>axios.post('/simi/mv', param),
  // 获取精品歌单
  getTopPlaylist:(param) => axios.post('/top/playlist/highquality', param),
  // 获取歌单列表
  getPalylist:(param)=>axios.post('/top/playlist', param)
}
