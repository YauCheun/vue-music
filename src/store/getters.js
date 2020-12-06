export const getters = {
    //获取歌曲名称
    getName: state => {
        return state.song.songName
    },
    //获取歌曲作者
    getAuthor: state => {
        return state.song.author
    },
    //获取歌曲的url地址
    getMusicUrl: state => {
        return state.song.src
    },
    //获取歌曲的image
    getImgUrl: state => {
        return state.song.picUrl
    },
    //获取当前歌曲的在播放列表中的index值
    getIndex: state => {
        return state.index
    },
}