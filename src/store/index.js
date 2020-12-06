import { mutations } from './mutations'
import { getters } from './getters'
import { actions } from './actions'
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        song: {  //当前所播放的歌曲对象
            name: "未播放音乐", //歌曲的名字
            songName: "", //暂时存储歌曲的名字，当歌曲可以播放时就将songName的值赋予name属性
            author: "未知", //歌手名
            musicUrl: "",//歌曲的地址
            // https://i.loli.net/2020/03/26/k1KaSpxN47qi9Xc.jpg  是默认的图片路径
            picUrl: "https://i.loli.net/2020/03/26/k1KaSpxN47qi9Xc.jpg",
            id: "",
            lyric: []//存储歌词的数组
        },
        list: [],//播放列表数组
        index: 0,//记录当前所播放的音乐在播放列表数组的索引值,
    },
    mutations,
    getters,
    actions
})
export default store;