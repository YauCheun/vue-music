<template>
  <div style="height:100%;width:100%"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)">
    <el-scrollbar style="height:100%">
      <div class="songs-container">
        <div class="tab-bar">
          <span class="item" :class="{ active: tag === 0 }" @click="tag = 0">全部</span>
          <span class="item" :class="{ active: tag === 7 }" @click="tag = 7">华语</span>
          <span class="item" :class="{ active: tag === 96 }" @click="tag = 96">欧美</span>
          <span class="item" :class="{ active: tag === 8 }" @click="tag = 8">日本</span>
          <span class="item" :class="{ active: tag === 16 }" @click="tag = 16">韩国</span>
        </div>
        <div class="list">
          <div class="list-item" v-for="item in songs" :key="item.id" @click="playSong(item)">
            <div class="img-wrap">
              <img :src="item.album.picUrl+'?param=150y150'" alt="" />
              <span class="iconfont icon-bofang5 play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
            <p class="author">{{ item.artists[0].name }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import api from '@/api/index.js'
import { mapActions  } from "vuex"
export default {
  data() {
    return{
      loading:true,
      songs: [],
      tag: 0
    }
  },
  created() {
    this._getNewSongs()
  },
  watch: {
    tag() {
      this._getNewSongs()
    }
  },
  methods:{
    ...mapActions([
      'getSong'
    ]),
    // 获取最新音乐
    async _getNewSongs() {
      this.loading=true
      const { data: resp } = await api.getNewSongs({ type: this.tag })
      this.songs = resp.data.slice(0, 100)
      this.loading=false
    },
    //播放音乐
    playSong(row){
      this.getSong({id:row.id,autoPlay:true})
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/css/global.scss";
  .songs-container{
    padding: 20px;
    width: 100%;
    // height: calc(100% - 55px);
    height: 100%;
    color:$fontColor;
    background-color: $bodyColor;
    .tab-bar{
      display: flex;
      justify-content: flex-end;
      .item {
        font-size: 15px;
        color: gray;
        margin-right: 20px;
        cursor: pointer;
      }
      .active {
        color: #ec4141;
      }
    }
    .list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .list-item{
        width: 20%;
        padding:12px;
        box-sizing: border-box;
        max-width: 200px;
        min-width: 100px;
        margin: 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .img-wrap{
          position: relative;
          &:hover .play{
            opacity: 1;
          }
          .play{
            position: absolute;
            right: 50%;
            top: 50%;
            transform: translate(50%,-50%);
            color: #ec4141;
            font-size: 20px;
            width:36px;
            height:36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.8);
            opacity: 0;
            // &::before{
            //   transform: translateY(1px);
            // }
          }
          img{
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }   
        }
        .name{
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 14px;
          color:$fontColor;
        }
        .author{
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          font-size: 14px;
          color:#c6c6c6;
        }
      }
    }
  }
</style>