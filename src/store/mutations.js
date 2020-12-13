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
  },
   // 更新播放状态，歌曲是否可以播放  歌曲名字由  正在加载中--->歌曲真正的名称
  upDateStatus(state, newName) {
    state.song.name = newName
  },

}