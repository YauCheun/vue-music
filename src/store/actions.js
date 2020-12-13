import api from "@/api/index.js"
// GetLyric, GetSongUrl, GetSongDetail 是封装的axios请求

export const actions = {
  //获取歌曲信息
  async getSong(context, data) {
    //获取歌曲详情（图片，歌曲名称，作者等信息）
    const result = await api.GetSongDetail({
        ids: data.id
    })
    console.log(result)
    let song = result.data.songs[0]
    let music = {
        id: data.id,
        name: "正在加载...",
        songName: song.name,
        picUrl: song.al.picUrl,
        author: song.ar[0].name,
    }
    //获取歌曲url
    let res = await api.GetSongUrl(
      data.id
    )
    console.log(res)
    //判断是否可以获取到歌曲的播放地址
    if (!res.data.data[0].url) {
        Vue.prototype.$message.error(`歌曲 ${music.songName} 是vip歌曲无法获取`);
        return;
    }
    // 获取歌词
    // let lyric = await GetLyric({
    //     id: data.id
    // })
    // //判断歌词是否存在
    // if (lyric.lrc) {
    //     lyric = lyric.lrc.lyric
    // } else {
    //     lyric = "暂无歌词"
    // }
    // let newlyric = parseLyric(lyric)
    music.src = res.data.data[0].url
    // music.lyric = newlyric
    let aotoplay = data.autoPlay
    context.commit("upDateSong", { music, aotoplay })
  }
}
