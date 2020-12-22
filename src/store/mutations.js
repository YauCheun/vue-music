import { satisfies } from "semver"

export const mutations = {
  //更新歌曲信息
  upDateSong(state, data) {
    state.song = data.music
    let music = data.music
    // 判断播放列表中是否已经存在该歌曲
    var result = state.list.findIndex(item => {
        return music.id === item.id
    })
    //不存在则添加到播放列表中
    if (result == -1) {
      var newsong = {
          name: music.songName,
          author: music.author,
          id: music.id,
          picUrl: music.picUrl
      }
      state.list.push(newsong);
      state.index = state.list.length - 1;
    } else {  //存在则只修改index的值
        state.index = result
    }
    //获取到audio标签
    var audio = document.getElementById("myaudio");
    if (data.aotoplay) {  //判断传递过来的aotoplay的值，因为在打开网页时歌曲是不自动播放的
        audio.setAttribute("autoplay", "autoplay");
    }
    //将歌曲列表存储到本地
    window.localStorage.setItem("musicState", JSON.stringify({ list: state.list, index: state.index }), new Date().getDate + 20);
  },
   // 更新播放状态，歌曲是否可以播放  歌曲名字由  正在加载中--->歌曲真正的名称
  upDateStatus(state, newName) {
    state.song.name = newName
  },
  //下一首
  next(state,modelObj){
    let model = modelObj.model
    //判断播放模式为列表循环或者单曲循环
    if(model%3==1||model%3==2){
      if(state.index==state.list.length-1){
        state.index=0
      }else{
        state.index++
      }
    }else{
      state.index= Math.ceil(Math.random() * state.list.length)
    }
    let data = state.list[state.index]
    console.log(data,state.list,model,state.index)
    this.dispatch('getSong',{id:data.id,autoPlay:true})
    window.localStorage.setItem("musicState", JSON.stringify({ list: state.list, index: state.index }), new Date().getDate + 20);
  },
  // 上一首
  prev(state,modelObj){
    let model = modelObj.model
    //判断播放模式为列表循环或者单曲循环
    if(model%3==1||model%3==2){
      if(state.index==0){
        state.index=state.list.length-1
      }else{
        state.index--
      }
    }else{
      state.index= Math.ceil(Math.random() * state.list.length)
    }
    let data = state.list[state.index]
    this.dispatch('getSong',{id:data.id,autoPlay:true})
    window.localStorage.setItem("musicState", JSON.stringify({ list: state.list, index: state.index }), new Date().getDate + 20);
  },
   // 初始化从本地读取缓存触发的事件,每次进来记录上次播放位置
  pushlist(state, oldstate) {
    //当播放列表存在时才触发
    if (oldstate.list) {
        state.list = oldstate.list;
        state.index = oldstate.index;
        let item = state.list[state.index]
        this.dispatch("getSong", { id: item.id, autoPlay: false })
    }
  },
   // 清空列表
  deleteAll(state) {
    state.list = []
    state.index = 0
    window.localStorage.setItem("musicState", JSON.stringify({ list: state.list, index: state.index }), new Date().getDate + 20);
  },
  deleteSong(state,index){
    if(state.index==index) state.index=0
    state.list.splice(index,1)
    window.localStorage.setItem("musicState", JSON.stringify({ list: state.list, index: state.index }), new Date().getDate + 20);
  }
}