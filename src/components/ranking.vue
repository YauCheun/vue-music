<template>
  <div style="height:100%;width:100%"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)">
    <el-scrollbar style="height:100%">
      <div class="recommend">
        <h3 class="title">
          全部排行榜
        </h3> 
        <div class="list">
          <div class="list-item" v-for="item in rankingList" :key="item.id" @click="toDetailList(item.id)">
            <div class="img-wrap">
              <div class="desc-wrap">
                <span class="desc">{{ item.description }}</span>
              </div>
              <img :src="item.coverImgUrl+'?param=200y200'" alt="" />
              <span class="iconfont icon-bofang5 play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import api from '@/api/index.js'
export default {
  data(){
    return {
      loading:true,
      rankingList:[]
    }
  },
  created(){
    this._getToplist()
  },
  methods:{
    async _getToplist(){
      this.loading=true
      const {data:res} = await api.getToplist()
      this.loading=false
      this.rankingList=res.list
      console.log(res)
    },
    toDetailList(id){
      this.$router.push(`/detaillist?id=${id}`)
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/css/global.scss";
    .recommend{
      padding: 20px;
      width: 100%;
      color:$fontColor;
      // height: calc(100% - 55px);
      height: 100%;
      background-color: $bodyColor;
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
            font-size: 12px;
            color: white;
            background: rgba(0, 0, 0, 0.5);
            max-height: 45px;
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
</style>