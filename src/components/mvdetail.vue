<template>
    <div style="height:100%;width:100%"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)">
    <el-scrollbar style="height:100%">
    <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="url" autoplay></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="icon+'?param=250y150'" alt="" />
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <span class="number">播放：{{ mvInfo.playCount }} 次</span>
          <p class="desc">
            {{ mvInfo.desc }}
          </p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap" v-if="hotComments !== undefined && hotComments.length !== 0">
        <p class="title">
          精彩评论<span class="number">({{ hotComments.length }})</span>
        </p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item, index) in hotComments" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl+'?param=50y50'" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">：{{ item.content }}</span>
              </div>
              <!-- 回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">：{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time | dateFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">
          最新评论<span class="number">({{ total }})</span>
        </p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item, index) in comments" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl+'?param=50y50'" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <span class="name">{{ item.user.nickname }}</span>
                <span class="comment">：{{ item.content }}</span>
              </div>
              <!-- 回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                <span class="comment">：{{ item.beReplied[0].content }}</span>
              </div>
              <div class="date">{{ item.time | dateFormat }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="pageSize">
      </el-pagination>
    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simiMvs" :key="index" @click="playMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover+'?param=250y150'" alt="" />
              <span class="iconfont icon-bofang5 icon-play"></span>
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
      </div>
    </div>
    </div>
  </el-scrollbar>
  </div>
</template>

<script>
import api from '@/api/index.js'
import eventBus from "@/util/eventBus.js"

export default {
  name: 'mvdetail',
  data() {
    return {
      loading:true,
      id: '',
      // 总条数
      total: 20,
      // 页码
      pageNum: 1,
      // 页容量
      pageSize: 10,
      // mv地址
      url: '',
      mvInfo: {},
      simiMvs: [],
      icon: '',
      hotComments: [],
      comments: []
    }
  },
  async created() {
    eventBus.$emit("paused")
    this.id = this.$route.query.id
    await this._getMvDetail()
    await this._getSimiMvUrl()
    await this._getMvComment()
    await this._getMvUrl()
    this.loading=false
  },
  async activated(){
    eventBus.$emit("paused")
    if(!(this.id&&this.$route.query.id==this.id)){
      this.id=this.$route.query.id
      this.loading=true
      await this._getMvDetail()
      await this._getSimiMvUrl()
      await this._getMvComment()
      await this._getMvUrl()
      this.loading=false
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNum = val
      this._getMvComment()
    },
    // 获取MV播放地址
    async _getMvUrl() {
      const { data: resp } = await api.getMvUrl({
        id: this.id,
        r: 1080
      })
      this.url = resp.data.url
    },

    // 获取MV详情
    async _getMvDetail() {
      const { data: resp } = await api.getMvDetail({
        mvid: this.id
      })
      this.mvInfo = resp.data
      // 获取歌手头像
      const { data: resp1 } = await api.getArtistIcon({
        id: this.mvInfo.artists[0].id
      })
      this.icon = resp1.artist.picUrl
    },

    // 获取MV评论
    async _getMvComment() {
      const { data: resp } = await api.getMvComment(this.id, {
        id: this.id,
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize
      })
      this.comments = resp.comments
      this.hotComments = resp.hotComments
      this.total = resp.total
    },

    // 获取相关MV
    async _getSimiMvUrl() {
      const { data: resp } = await api.getSimiMvUrl({
        mvid: this.id
      })
      this.simiMvs = resp.mvs
    },

    playMv(id) {
      this.pageNum = 1
      this.id = id
      this._getMvUrl()
      this._getMvDetail()
      this._getSimiMvUrl()
      this._getMvComment()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/global.scss";
.mv-container {
  padding:20px;
  display: flex;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  color:$fontColor;
  background-color: $bodyColor;
  .title {
    margin-bottom: 20px;
  }
  .mv-wrap {
    width: 700px;
    margin-right: 35px;
    .date {
      margin-right: 25px;
      color: #bebebe;
      font-size: 14px;
    }
    .number {
      color: #bebebe;
      font-size: 14px;
    }
    .video-wrap {
      width: 100%;
      height: 390px;
      margin-bottom: 20px;
      video {
        border-radius: 5px;
        height: 100%;
        width: 100%;
        outline: none;
      }
    }
    .info-wrap {
      margin-bottom: 50px;
      .singer-info {
        display: flex;
        align-items: center;
        margin-bottom: 35px;
        .avatar-wrap {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          margin-right: 10px;
          overflow: hidden;
          img {
            height: 100%;
          }
        }
      }
      .mv-info {
        .title {
          font-size: 30px;
        }
        .desc {
          font-size: 15px;
          margin-top: 20px;
        }
      }
    }
    .comment-wrap {
      margin-bottom: 70px;
      .title {
        font-size: 25px;
        .number {
          color:$fontColor;
          font-size: 20px;
        }
      }
      .item {
        display: flex;
        padding-top: 20px;
        .icon-wrap {
          margin-right: 15px;
          img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        &:not(:last-child) .content-wrap {
          border-bottom: 1px solid #aeaeae;
        }
        .content-wrap {
          padding-bottom: 20px;
          flex: 1;
          .name {
            color: #517eaf;
            font-size: 14px;
          }
          .comment {
            font-size: 14px;
          }
          .content{
            margin-bottom: 10px;
          }
          .re-content{
            margin-bottom: 10px;
            padding: 10px;
            background-color: $hoverColor;
            border-radius: 5px;
          }
        }
      }
    }
  }
  .mv-recommend {
    flex: 1;
    .mvs {
      .items {
        display: flex;
        flex-wrap: wrap;
        .item {
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          padding: 10px;
          cursor: pointer;
          &:hover {
            background-color: $hoverColor;
          }
          .img-wrap {
            width: 180px;
            position: relative;
            margin-right: 10px;
            > .icon-play {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
              color: #dd6d60;
              font-size: 24px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(255, 255, 255, 0.8);
              opacity: 0;
              // &::before {
              //   transform: translateX(1px);
              // }
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
              color: white;
              top: 0;
              right: 0;
              display: flex;
              align-content: center;
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
              color: white;
              font-size: 15px;
            }
          }
          .info-wrap {
            flex: 1;
            .name {
              font-size: 15px;
            }
            .singer {
              font-size: 14px;
              color: #c5c5c5;
            }
          }
        }
      }
    }
  }
}
</style>
