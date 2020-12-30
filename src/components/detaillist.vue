<template>
  <div class="detaillist-contanier"  
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)">
    <el-scrollbar style="height:100%">
    <div class="top-wrap">
      <div class="img-wrap">
        <!-- 封面 -->
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <!-- 名字 -->
        <p class="title"><span>歌单</span>{{ playlist.name }}</p>
        <div class="author-wrap">
          <!-- 头像 -->
          <!-- 神经病VUE,不加v-if="playlist.creator !== undefined" 报错 -->
          <img class="avatar" :src="playlist.creator.avatarUrl" v-if="playlist.creator !== undefined" alt="" />
          <!-- 名字 -->
          <span class="name" v-if="playlist.creator !== undefined">{{ playlist.creator.nickname }}</span>
          <!-- 时间 -->
          <span class="time">{{ playlist.createTime | dateFormat }}</span>
        </div>
        <div class="btn-box">          
          <div class="play-wrap">
            <span class="iconfont icon-bofang5"></span>
            <span class="text" @click="playAll">播放全部</span>
          </div>
          <div class="play-wrap add">
            <span class="iconfont icon-jiatianjiakuangxuanduoxuan-8"></span>
            <span class="text" @click="addList">添加</span>
          </div>
          <div class="play-wrap add">
            <span class="iconfont icon-fenxiang_2"></span>
            <span class="text">分享({{playlist.shareCount}})</span>
          </div>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <ul>
            <li v-for="(item, index) in playlist.tags" :key="index">{{ item }}</li>
          </ul>
        </div>
        <div class="song">
          <div>歌曲: <span>{{playlist.trackCount}}</span></div>
          <div style="margin-left:10px;">播放: <span>{{(playlist.playCount/10000).toFixed(2)}}万</span></div>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div> 
  <el-tabs v-model="activeIndex" class="tabs">
    <el-tab-pane label="歌曲列表" name="1">
      <el-table
        :data="tableData"
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
    <el-tab-pane :label="`评论(${total})`" name="2">
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
    </el-tab-pane>
  </el-tabs>
  </el-scrollbar>
  </div>
</template>

<script>
import api from "@/api"
import { mapActions  } from "vuex"
export default {
  name:'detaillist',
  data(){
    return {
      loading:true,
      id:'',
      activeIndex:'1',
      tableData:[],
      playlist:{}, //歌单详情
      avatarUrl:'',//头像url
      nickname:'',// 昵称
      comments:[],//评论
      hotComments:[],//热门评论
      total:10,
      pageNum:1,//当前页数
      pageSize:10//页面数量
    }
  },
  async created() {
    this.id=this.$route.query.id
    await this.getDetailList(this.id)
    await this.getPlaylistComments()
    this.loading=false
    //getDetailList
  },
  async activated(){
    if(!(this.id&&this.$route.query.id==this.id)){
      this.id=this.$route.query.id
      this.loading=true
      await this.getDetailList(this.id)
      await this.getPlaylistComments()
      this.loading=false
    }
  },
  // watch:{
  //   'this.$route.query.id':{
  //     handler(val){
  //       this.id=val
  //       this.getDetailList(val)
  //       this.getPlaylistComments()
  //     }
  //   }
  // },
  methods:{
    ...mapActions([
      'getSong'
    ]),
    //播放音乐
    playSong(row){
      this.getSong({id:row.id,autoPlay:true})
    },
    //获取歌单详情
    async getDetailList(id){
      try {
        let res = await api.getDetailList(id)
        console.log(res)
        this.playlist=res.data.playlist
        this.avatarUrl =res.data.playlist.creator.avatarUrl
        this.nickname = res.data.playlist.creator.nickname
        this.tableData=res.data.playlist.tracks
        this.tableData.forEach(item=>{
          item.picUrl=item.al.picUrl
          item.zjName=item.al.name
          item.singerName=item.ar[0].name
          item.time= this.$options.filters['playTimeFormat'](item.dt)
        })
      } catch (error) {
        console.log(error)
        this.$message.error('获取歌单详情失败')
      }
    },
    // 获取歌单评论
    async getPlaylistComments() {
      try {
        const res = await api.getPlaylistComments({
          id: this.id,
          limit: this.pageSize,
          offset: (this.pageNum - 1) * this.pageSize
        })
        this.comments = res.data.comments
        this.hotComments =  res.data.hotComments
        this.total =  res.data.total
      } catch (error) {
        console.log(error)
        this.$message.error('获取歌单评论失败')
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getPlaylistComments()
    },
    async playAll(){
      for(let i=0;i<this.tableData.length;i++){
        await this.getSong({id:this.tableData[i].id,autoPlay:false})
      }
      this.getSong({id:this.tableData[0].id,autoPlay:true})
    },
    async addList(){
      for(let i=0;i<this.tableData.length;i++){
        await this.getSong({id:this.tableData[i].id,autoPlay:false})
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/global.scss";
.detaillist-contanier{
  margin: auto;
  padding: 20px;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  color:$fontColor;
  background-color: $bodyColor;
  .top-wrap{
    display: flex;
    span{
      font-size: 17px;
    }
    .img-wrap{
      margin-right: 30px;
      img{
        width: 200px;
        height: 200px;
        border-radius: 8px;
      }
    }
    .info-wrap{
      .title{
        margin-bottom: 10px;
        font-size: 24px;
        font-weight: 700;
        color:$fontColor;
        span{
          border: 1px solid #EC4141;
          border-radius: 3px;
          color:#EC4141;
          font-size: 12px;
          vertical-align: middle;
          height: 18px;
          line-height: 18px;
          width: 36px;
          padding: 2px 3px;
          margin-right: 10px;
          margin-top: 10px;
          text-align: center;
        }
      }
      .author-wrap{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        img{
          width: 35px;
          height: 35px;
          border-radius: 50%;
          margin-right: 10px;
          cursor: pointer;
        }
        .name{
          margin-right: 10px;
          color:#507DAF;
          font-size: 14px;
          cursor: pointer;
        }
        .time{
          color:$fontColor;
          font-size: 14px;
        }
      }
      .btn-box{
        display:flex;
        cursor: pointer;
        .play-wrap{
          margin-right: 10px;
          width: 120px;
          height: 32px; 
          opacity: 0.8;
          border-radius: 16px;
          background: #EC4141;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          &:hover{
            opacity: 1;
          }
          span{
            font-size: 14px;
            color:#fff;
          }
          .iconfont{
            margin-right: 8px;
          }
          .text{
            color:#fff;
            font-size: 14px;
          }
        }
        .add{
          background-color: rgba(255,255,255,0);
          border: 1px solid #7c7c7c;
          .iconfont{
            color:#7c7c7c;
            margin-top:1px;
          }
          .text{
            color:$fontColor;
          }
        }
      }
      .tag-wrap{
        font-size: 14px;
        display: flex;
        margin-bottom: 5px;
        span{
          margin: 0;
          font-size: 14px;
        }
        ul{
          display: flex;
          margin-left:5px;
          align-items: center;
          li{
            color:#507DAF;
            cursor: pointer;
            font-size: 14px;
            &:not(:last-child)::after{
              content: '/';
              color:$fontColor;
              margin: 0 4px;
            }
          }
        }
      }
      .song{
        margin-bottom: 5px;
        div{
          color:$fontColor;
          font-size: 14px;
          display:inline-block;
          span{
            font-size: 14px;
            color:#7c7c7c;
          }
        }
      }
      .desc-wrap{
        .title{
          font-size: 14px;
        }
        span{
          &:last-child{
            display:inline-block;
            width: 500px;
            vertical-align: top;
            font-size: 14px;
            color:#7c7c7c;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
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
  .comment-wrap{
    .title{
      font-size: 18px;
      .number{
        color:$fontColor;
        font-size: 18px;
      }
    }
    .comments-wrap{
      .item{
        display: flex;
        padding-top: 20px;
        &:not(:last-child){
          border-bottom: 1px solid#AEAEAE;
        }
        .icon-wrap{
          margin-right: 15px;
          cursor: pointer;
          img{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
        }
        .date{
          color: #bebebe;
          font-size: 14px;
        }
        .content-wrap{
          padding-bottom: 20px;
          flex: 1;
          .name{
            color: #517eaf;
            font-size: 14px;
            cursor: pointer;
          }
          .comment{
            font-size: 14px;
            color:$fontColor;
          }
          .content{
            margin-bottom: 10px;
          }
          .re-content{
            margin-bottom: 10px;
            padding: 10px;
            background-color:$hoverColor;
            border-radius: 5px;
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