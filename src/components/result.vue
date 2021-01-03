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
        <el-table
        :data="songs"
        stripe
        style="width: 100%"
        >
        <!-- <el-table-column
          align="center"
          prop="index"
          label="序号"
          width="50">
          <template slot-scope="scope">
            <span >{{scope.$index}}</span>
          </template>
        </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            width="80">
            <template slot-scope="scope">
              <div class="img">
                <img :src="scope.row.picUrl+'?param=130y130'" style="width:50px;" alt="">
                <i class="iconfont icon-bofang5 play" @click="playSong(scope.row)"></i>
              </div> 
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="音乐标题">
          </el-table-column>
          <el-table-column
            prop="singerName"
            label="歌手">
          </el-table-column>
          <el-table-column
            prop="zjName"
            label="专辑">
          </el-table-column>
          <el-table-column
            prop="time"
            label="时长">
          </el-table-column>
        </el-table>
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
              <span class="iconfont icon-bofang5 icon-play"></span>
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
              <span class="iconfont icon-bofang5 icon-play"></span>
              <div class="num-wrap">
                <div class="iconfont icon-bofang1 icon-play"></div>
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
    //播放音乐
    playSong(row){
      this.getSong({id:row.id,autoPlay:true})
    },
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
        this.songs.forEach(item=>{
          item.picUrl=item.album.artist.picUrl?item.album.artist.picUrl:item.album.artist.img1v1Url
          item.zjName=item.album.name
          item.singerName=item.artists[0].name 
          item.time= this.$options.filters['playTimeFormat'](item.duration)
        })
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
      this.$router.push(`/detaillist?id=${id}`)
    },

    toMv(id) {
      this.$router.push(`/mvdetail?id=${id}`)
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
          width: 36px;
          height: 36px;
          color: #dd6d60;
          font-size: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.8);
          opacity: 0;
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
          color: #fff;
          top: 0;
          right: 0;
          display: flex;
          align-items: center;
          font-size: 14px;
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
    .el-table__body-wrapper{
    .img{
      width:50px;
      height:50px;
      position: relative;
      cursor: pointer;
      border-radius: 8px;
      img{
        border-radius: 8px;
      }
      .play{
        position: absolute;
        padding-top:1px;
        box-sizing: border-box;
        padding-left: 1px;
        top:12px;
        left:12px;
        color: #ec4141;
        font-size: 12px;
        width:26px;
        height:26px;
        border-radius: 50%;
        background: rgba(255, 255, 255, .8);
      }
    }
  }

  }
  
}
</style>
<style lang="scss">
@import "@/assets/css/global.scss";
.list{
  .el-table__body-wrapper.is-scrolling-left {
    overflow-x: hidden!important;
  }
}
.el-table{
  &::before{
    height:0;
  }
}
.el-table td, .el-table th{
  padding: 2px 0;
}
.el-table--scrollable-x .el-table__body-wrapper{
  overflow-x: hidden!important;
}
thead.has-gutter{
  tr{
    background: $bodyColor!important;
    border-bottom:1px solid $hoverColor;
    th{
      background: $bodyColor!important;
      border-bottom:none;
      // border-bottom:1px solid $hoverColor!important;
    }
  }
}
tr.el-table__row{
  cursor: pointer;
  background: $bodyColor!important;
  &:hover td{
    background-color:#F5F7FA!important;
  }
  td{
    background: $bodyColor;
    border-bottom:none;
  }

}
tr.el-table__row.el-table__row--striped{
  background: $hoverColor!important;
  &:hover td{
    background-color:#F5F7FA!important;
  }
  td{
    background: $hoverColor!important;
    border-bottom:none;
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
</style>
