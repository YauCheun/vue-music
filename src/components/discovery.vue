<template>
  <div class="discovery-container">
    <el-scrollbar style="height:100%;width:100%">
      <div class="banner">
        <el-carousel :interval="4000" type="card" height="250px">
          <el-carousel-item v-for="item in bannerList" :key="item.imageUrl">
            <img :src="item.imageUrl" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div> 
      <div class="recommend">
        <h3 class="title">
          推荐歌单 <i class="iconfont icon-zuoyou" style="font-size:14px;"></i>
        </h3> 
        <div class="list">
          <div class="list-item" v-for="item in recommendList" :key="item.id">
            <div class="img-wrap">
              <div class="desc-wrap">
                <span class="desc">{{ item.copywriter }}</span>
              </div>
              <img :src="item.picUrl+'?param=200y200'" alt="" />
              <span class="iconfont icon-bofang5 play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="privatecontent">
        <h3 class="title">
          独家放送 <i class="iconfont icon-zuoyou" style="font-size:14px;"></i>
        </h3> 
        <div class="list">
          <div class="list-item" v-for="item in privateList" :key="item.picUrl">
            <div class="img-wrap">
              <img :src="item.sPicUrl" alt="" />
              <span class="iconfont icon-bofang5 play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="newsong">
        <h3 class="title">
          最新单曲 <i class="iconfont icon-zuoyou" style="font-size:14px;"></i>
        </h3> 
        <div class="list">
          <div class="list-item" v-for="item in newSongList" :key="item.picUrl">
            <div class="img-wrap">
              <img :src="item.picUrl+'?param=50y50'" alt="" />
              <span class="iconfont icon-bofang5 play"></span>   
            </div>
            <div class="detail">
              <p class="name">{{ item.name }}</p>
              <span class="singer"><i class="iconfont icon-sq"></i><span>{{item.artists}}</span></span>
            </div>
          </div>
        </div>
      </div>
      <div class="mv">
        <h3 class="title">
          推荐MV <i class="iconfont icon-zuoyou" style="font-size:14px;"></i>
        </h3> 
        <div class="list">
          <div class="list-item" v-for="item in mvList" :key="item.id">
            <div class="img-wrap">
              <div class="desc-wrap">
                <span class="desc">{{ item.copywriter }}</span>
              </div>
              <img :src="item.picUrl" alt="" />
              <span class="iconfont icon-bofang1 play"><span>{{item.playCount}}</span></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import api from "@/api"
export default {
  data() {
    return {
      bannerList:[],//轮播数据
      recommendList:[], //推荐歌单
      privateList:[], //独家放送
      newSongList:[], //最新单曲
      mvList:[] //推荐mv
    }
  },
  created() {
    this.getBanner()
    this.getRecommend()
    this.getPrivatecontent()
    this.getNewSong()
    this.getRecommendMv()
  },
  methods: {
    //获取轮播图
    async getBanner(){
      try {
        let res = await api.getBanner({type:0})
        this.bannerList=res.data.banners
      } catch (error) {
        console.log(error)
        this.$message.error('获取轮播图失败')
      }
    },
    //获取推荐歌单
    async getRecommend(){
      try {
        let res = await api.getRecommend({limit:10})
        this.recommendList=res.data.result
      } catch (error) {
        console.log(error)
        this.$message.error('获取推荐歌单失败')
      }
    },
    //获取独家放送
    async getPrivatecontent(){
      try {
        let res = await api.getPrivatecontent()
        this.privateList=res.data.result
      } catch (error) {
        console.log(error)
        this.$message.error('获取独家放送失败')
      }
    },
    //获取最新单曲
    async getNewSong(){
      try {
        let res = await api.getNewSong()
        res.data.result.pop()
        this.newSongList=res.data.result
        this.newSongList.forEach(item=>{
          item.artists=item.song.album.artists.reduce((total,value,index)=>{
            total=index==0?value.name:total+'/'+value.name
            return total
          },'')
        })
      } catch (error) {
        console.log(error)
        this.$message.error('获取最新单曲失败')
      }
    },
    //获取推荐mv
    async getRecommendMv(){
      try {
        let res = await api.getRecommendMv()
        console.log(res)
        this.mvList=res.data.result
      } catch (error) {
        console.log(error)
        this.$message.error('获取推荐mv失败')
      }
    },
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/css/global.scss";
.discovery-container{
  padding: 20px;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  background-color: $bodyColor;
  .banner{
    width: calc(100% - 40px);
    .el-carousel__container {
      height: 230px;
    }
    .el-carousel__item img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
  .recommend{
    .title{
      line-height: 25px;
      vertical-align: middle;
      color:$fontColor;
      cursor: pointer;
    }
    .list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .list-item{
        width: 20%;
        max-width: 200px;
        min-width: 100px;
        margin: 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        &:hover .img-wrap .desc-wrap{
          top: 0;
        }
        .img-wrap{
          position: relative;
          &:hover .play{
            opacity: 1;
          }
          .desc-wrap{
            position: absolute;
            width: 100%;
            border-radius: 3px;
            top: 0;
            left: 0;
            font-size: 16px;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            max-height: 50px;
            padding: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            top: -50px;
            span{
              font-size: 14px;
            }
          }
          .play{
            position: absolute;
            right: 10px;
            bottom: 13px;
            color: #ec4141;
            font-size: 18px;
            width:30px;
            height:30px;
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
      }
    }
  }
  .privatecontent{
    margin-top:20px;
    .title{
      line-height: 25px;
      vertical-align: middle;
      color:$fontColor;
      cursor: pointer;
    }
    .list{
      display:flex;
      flex-wrap: wrap;
      width: 100%;
      .list-item{
        width:33%;
        padding: 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .img-wrap{
          position: relative;
          text-align: center;
          img{
            width: calc(100% - 20px);
            border-radius: 8px;
          }
          .play{
            position: absolute;
            left: 20px;
            top: 13px;
            color: #fff;
            font-size: 10px;
            width:25px;
            height:25px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0, 0, 0, 0.2);
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
          padding: 0 10px;
        }
      }
    }
  }
  .newsong{
    margin-top:20px;
    .title{
      line-height: 25px;
      vertical-align: middle;
      color:$fontColor;
      cursor: pointer;
    }
    .list{
      display:flex;
      flex-wrap: wrap;
      width: 100%;
      .list-item{
        width:33%;
        padding: 10px;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        cursor: pointer;
        .img-wrap{
          width:50px;
          position: relative;
          text-align: center;
          img{
            width: 50px;
            border-radius: 5px;
          }
          .play{
            position: absolute;
            left: 13px;
            top: 13px;
            color: #ec4141;
            font-size: 12px;
            width:24px;
            height:24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, .8);
            &::before{
              transform: translate(1px,0);
            }
          }
        }
        .detail{
          width:calc(100% - 50px);
          padding: 5px 0 0 10px;
          box-sizing: border-box;
          height:50px;
          .name{
            font-size: 14px;
            color:$fontColor;
          }
          .singer{
            font-size: 12px;
            color: #9F9F9F;
            span{
              font-size: 14px;
              line-height: 26px;
              vertical-align: top;
              margin-left: 5px;
            }
            .icon-sq{
              color:#EC4141;
              font-size: 24px;
            }
          }
        }
      }
    }
  }
  .mv{
    .title{
      line-height: 25px;
      vertical-align: middle;
      color:$fontColor;
      cursor: pointer;
    }
    .list{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .list-item{
        width: 25%;
        padding: 10px;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        &:hover .img-wrap .desc-wrap{
          top: 0;
        }
        &:hover .img-wrap .play{
          opacity: 0;
        }
        .img-wrap{
          position: relative;
          .desc-wrap{
            position: absolute;
            width: 100%;
            border-radius: 8px;
            top: 0;
            left: 0;
            font-size: 14px;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            max-height: 50px;
            padding: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            top: -60px;
            span{
              font-size: 14px;
            }
          }
          .play{
            position: absolute;
            right: 20px;
            top: 5px;
            color: #efefef;
            font-size: 14px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 1;
            span{
              font-size: 12px;
              margin-left: 5px;;
            }
          }
          img{
            width: 100%;
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
      }
    }
  }
}
</style>