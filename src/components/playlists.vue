<template>
  <div style="height:100%;width:100%"  
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-scrollbar style="height:100%">
    <div class="playlists-container">
    <!-- 同步 -->
    <div class="top-card">
      <!-- 封面 -->
      <div class="icon-wrap">
        <img :src="topPlayList.coverImgUrl+'?param=200y200'" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">
          {{ topPlayList.title }}
        </div>
        <!-- 介绍 -->
        <div class="info">
          {{ topPlayList.description }}
        </div>
      </div>
      <!-- 背景 -->
      <img :src="topPlayList.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>

    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span class="item" @click="tag = '全部'" :class="{ active: tag === '全部' }">全部</span>
        <span class="item" @click="tag = '欧美'" :class="{ active: tag === '欧美' }">欧美</span>
        <span class="item" @click="tag = '华语'" :class="{ active: tag === '华语' }">华语</span>
        <span class="item" @click="tag = '流行'" :class="{ active: tag === '流行' }">流行</span>
        <span class="item" @click="tag = '说唱'" :class="{ active: tag === '说唱' }">说唱</span>
        <span class="item" @click="tag = '摇滚'" :class="{ active: tag === '摇滚' }">摇滚</span>
        <span class="item" @click="tag = '民谣'" :class="{ active: tag === '民谣' }">民谣</span>
        <span class="item" @click="tag = '电子'" :class="{ active: tag === '电子' }">电子</span>
        <span class="item" @click="tag = '轻音乐'" :class="{ active: tag === '轻音乐' }">轻音乐</span>
        <span class="item" @click="tag = '影视原声'" :class="{ active: tag === '影视原声' }">影视原声</span>
        <span class="item" @click="tag = 'ACG'" :class="{ active: tag === 'ACG' }">ACG</span>
        <span class="item" @click="tag = '怀旧'" :class="{ active: tag === '怀旧' }">怀旧</span>
      </div>
      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item, index) in playlists" :key="item.id" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <img :src="item.coverImgUrl+'?param=200y200'" alt="" />
              <span class="iconfont icon-bofang5 icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器 -->
    <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="pageSize">
    </el-pagination>
    </div>
    </el-scrollbar>
  </div>
</template>

<script>
import api from "@/api/index.js"

export default {
  name: 'recommend',
  data() {
    return {
      loading:true,
      // 总条数
      total: 0,
      // 页码
      pageNum: 1,
      pageSize: 40,
      tag: '全部',
      // 顶部精品歌单
      topPlayList: {},
      // 歌单列表
      playlists: []
    }
  },

  async created() {
    await this._getTopPlaylist()
    await this._getPlaylist()
    this.loading=false
  },

  methods: {
    // 页码改变事件
    handleCurrentChange(val) {
      // 保存页码
      this.pageNum = val
      // 重新获取数据
      this._getPlaylist()
    },

    // 获取精品歌单
    async _getTopPlaylist() {
      const { data: resp } = await api.getTopPlaylist({ cat: this.tag, limit: 1 })
      this.topPlayList = resp.playlists[0]
    },

    // 获取歌单列表
    async _getPlaylist() {
      const { data: resp } = await api.getPalylist({
        cat: this.tag,
        limit: this.pageSize,
        total: true,
        offset: (this.pageNum - 1) * this.pageSize,
        order: 'hot'
      })
      this.playlists = resp.playlists
      this.total = resp.total
    },
    toPlaylist(id) {
      this.$router.push(`/detaillist?id=${id}`)
    }
  },
  //　监听器
  watch: {
    tag() {
      this.pageNum = 1
      this._getTopPlaylist()
      this._getPlaylist()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/global.scss";
.playlists-container{
  padding: 20px;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  color:$fontColor;
  background-color: $bodyColor;
  .top-card {
    padding: 20px;
    height: 200px;
    display: flex;
    position: relative;
    overflow: hidden;
    border-radius: 5px;
    .icon-wrap {
      margin-right: 20px;
      z-index: 1;
      img {
        width: 160px;
        height: 160px;
      }
    }
    .content-wrap {
      z-index: 1;
      .tag {
        color: #dfac67;
        border: 1px solid #dfac67;
        width: 100px;
        height: 30px;
        text-align: center;
        border-radius: 5px;
        font-size: 16px;
        line-height: 30px;
        cursor: pointer;
      }
      .title {
        color: white;
        padding-top: 10px;
      }
      .info {
        color: #888482;
        font-size: 14px;
        padding-top: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
      }
    }
    .bg {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      filter: blur(20px);
    }
    .bg-mask {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
  .tab-container {
    padding-top: 30px;
    .tab-bar {
      display: flex;
      justify-content: flex-end;
      .item {
        font-size: 15px;
        color: gray;
        margin-right: 20px;
        cursor: pointer;
      }
      .active {
        color: #dd6d60;
      }
    }
    .tab-content {
      margin-top: 20px;
      .items {
        display: flex;
        flex-wrap: wrap;
        .item {
          width: 200px;
          margin: 10px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          img {
            width: 200px;
            height: 200px;
            border-radius: 5px;
          }
          .num-wrap {
            position: absolute;
            top: 0;
            left: 0;
            font-size: 14px;
            color: white;
            line-height: 30px;
            background: rgba(0, 0, 0, 0.5);
            height: 30px;
            width: 100%;
            padding-left: 5px;
            top: -30px;
            overflow: hidden;
          }
          &:hover .num-wrap {
            top: 0;
          }
          .img-wrap {
            position: relative;
            .icon-play {
              position: absolute;
              right: 10px;
              bottom: 13px;
              width: 30px;
              height: 30px;
              color: #dd6d60;
              font-size: 20px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(255, 255, 255, 0.8);
              opacity: 0;
              &::before {
                transform: translateY(1px);
              }
            }
            &:hover .icon-play {
              opacity: 1;
            }
          }
          .name {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
