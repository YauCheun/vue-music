<template>
  <div style="height:100%;width:100%"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)">
  <el-scrollbar style="height:100%">
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title" :keywords="(keywords = $route.query.q)">“{{ $route.query.q }}”</h2>
      <!-- <h2 class="title">{{ keywords }}</h2> -->
      <span class="sub-title">找到{{ count }}个{{ activeIndex }}</span>
    </div>
    <el-tabs v-model="activeIndex" class="tabs">
      <el-tab-pane label="歌曲" name="单曲">
        <table class="el-table">
          <thead>
            <th></th>
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr class="el-table__row" v-for="(item, index) in songs" :key="index" @click="playMusic(item.id)">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 名称 -->
                    <span>{{ item.name }}</span>
                    <!-- mv图标 -->
                    <span v-if="item.mvid !== 0" class="iconfont icon-mv" @click.stop="toMv(item.mvid)"></span>
                  </div>
                  <!-- 二级标题 -->
                  <span v-if="item.alias.length !== 0">{{ item.alias[0] }}</span>
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration | playTimeFormat }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>

      <el-tab-pane label="歌单" name="歌单">
        <div class="items">
          <div class="item" v-for="(item, index) in playlists" :key="index" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount | playNumFormat }}</span>
              </div>
              <img :src="item.coverImgUrl+'?param=200y200'" alt="" />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="MV" name="MV">
        <div class="items mv">
          <div class="item" v-for="(item, index) in mvs" :key="index" @click="toMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover+'?param=250y150'" alt="" />
              <span class="iconfont icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-play"></div>
                <div class="num">{{ item.playCount | playNumFormat }}</div>
              </div>
              <span class="time">{{ item.duration | playTimeFormat }}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 分页器 -->
    <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="pageSize">
    </el-pagination>
  </div>
  </el-scrollbar>
  </div>
</template>

<script>
import api from "@/api/index.js"
import { mapActions  } from "vuex"
export default {
  name: 'result',
  data() {
    return {
      loading:true,
      // 总条数
      total: 0,
      // 页码
      pageNum: 1,
      pageSize: 10,
      keywords: '',
      activeIndex: '单曲',
      songs: [],
      count: 0,
      playlists: [],
      mvs: [],
      songId: 0,
      type: 1
    }
  },

  created() {
    // this._search()
  },
  
  watch: {
    keywords() {
      this._search()
    },

    activeIndex() {
      switch (this.activeIndex) {
        case '单曲':
          this.type = 1
          this.pageNum = 1
          break
        case '歌单':
          this.type = 1000
          this.pageNum = 1
          break
        case 'MV':
          this.type = 1004
          this.pageNum = 1
          break

        default:
          break
      }
      this._search()
    }
  },

  methods: {
    ...mapActions([
      'getSong'
    ]),
    // 页码改变事件
    handleCurrentChange(val) {
      // 保存页码
      this.pageNum = val
      // 重新获取数据
      this._search()
    },

    async _search() {
      this.loading=true
      var timestamp = new Date().getTime()
      const { data: resp } = await api.search({
        timestamp: timestamp,
        keywords: this.keywords,
        type: this.type,
        limit: this.type === 1004 ? 8 : 10,
        offset: (this.pageNum - 1) * (this.type === 1004 ? 8 : 10)
      })
      if (resp.code !== 200) {
        return
      }
      if (this.type === 1) {
        this.songs = resp.result.songs
        this.count = resp.result.songCount
      } else if (this.type === 1000) {
        this.playlists = resp.result.playlists
        this.count = resp.result.playlistCount
      } else if (this.type === 1004) {
        this.mvs = resp.result.mvs
        this.count = resp.result.mvCount
      }
      this.total = this.count
      this.loading=false
    },

    async playMusic(id) {
      this.getSong({id:row.id,autoPlay:true})
    },

    toPlaylist(id) {
      this.$router.push(`/playlist?id=${id}`)
    },

    toMv(id) {
      this.$router.push(`/mv?id=${id}`)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/global.scss";
.result-container {
  padding: 20px;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  color:$fontColor;
  background-color: $bodyColor;
  .title-wrap {
    display: flex;
    align-items: flex-end;
    margin-bottom: 30px;
    .title {
      margin-right: 10px;
    }
    .sub-title {
      font-size: 15px;
      color:$fontColor;
    }
  }
  .el-tabs__item {
    font-size: 18px;
  }
  .items {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    .item {
      width: 200px;
      cursor: pointer;
      margin-right: 20px;
      margin-bottom: 20px;
      .img-wrap {
        width: 100%;
        position: relative;
        & > .icon-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          color: #dd6d60;
          font-size: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          opacity: 0;
          &::before {
            transform: translateX(3px);
          }
        }
        &:hover > .icon-play {
          opacity: 1;
        }
        img {
          width: 100%;
          border-radius: 5px;
        }
        .num-wrap {
          position: absolute;
          color:$fontColor;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          font-size: 15px;
          padding-right: 5px;
          padding-top: 2px;
          .icon-play {
            font-size: 12px;
            display: flex;
            align-items: center;
            margin-right: 5px;
          }
        }
        .time {
          position: absolute;
          bottom: 5px;
          right: 5px;
          color:$fontColor;
          font-size: 15px;
        }
      }
      .name {
        font-size: 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      .singer {
        font-size: 14px;
        color:$fontColor;
      }
      .item {
        width: 250px;
      }
    }
  }
  .el-table{
    thead{
      th {
        color:$fontColor;
        background-color: $bodyColor;
        border-bottom: none;
      }
    }
    color:$fontColor;
    background-color: $bodyColor;
    td{
      color:$fontColor;
      background-color: $bodyColor;
      border-bottom: none;
    }
    th{
      color:$fontColor;
      background-color: $bodyColor;
      border-bottom: none;
    }
    th.is-leaf {
      color:$fontColor;
      background-color: $bodyColor;
      border-bottom: none;
    }
  } 
  .tabs {
    .el-tabs__item{
      color:$fontColor;
      &:hover{
        color: #409EFF
      }
    }
    .is-active{
      color: #409EFF
    }
  }
}
</style>
