<template>
  <div style="height:100%;width:100%"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)">
      <el-scrollbar style="height:100%">
        <div class="singer-container">
          <div class="filter-wrap">
            <div class="seciton-wrap">
              <span class="section-type" style="font-size:12px">语种:</span>
              <ul class="tabs-wrap">
                <li class="tab"><span class="title" @click="area = '-1'" :class="{ active: area === '-1' }">全部</span></li>
                <li class="tab"><span class="title" @click="area = '7'" :class="{ active: area === '7' }">华语</span></li>
                <li class="tab"><span class="title" @click="area = '96'" :class="{ active: area === '96' }">欧美</span></li>
                <li class="tab"><span class="title" @click="area = '8'" :class="{ active: area === '8' }">日本</span></li>
                <li class="tab"><span class="title" @click="area = '16'" :class="{ active: area === '16' }">韩国</span></li>
                <li class="tab"><span class="title" @click="area = '0'" :class="{ active: area === '0' }">其他</span></li>
              </ul>

            </div>
            <div class="type-wrap">
              <span class="type-type" style="font-size:12px">分类:</span>
              <ul class="tabs-wrap">
                <li class="tab">
                  <span class="title" @click="type = '-1'" :class="{ active: type === '-1' }">全部</span>
                </li>
                <li class="tab">
                  <span class="title" @click="type = '1'" :class="{ active: type === '1' }">男歌手</span>
                </li>
                <li class="tab">
                  <span class="title" @click="type = '2'" :class="{ active: type === '2' }">女歌手</span>
                </li>
                <li class="tab">
                  <span class="title" @click="type = '3'" :class="{ active: type === '3' }">乐队组合</span>
                </li>
              </ul>
            </div>
            <div class="order-wrap" >
              <span class="order-type" style="font-size:12px">筛选:</span>
              <ul class="tabs-wrap">
                <li class="tab" style="margin-bottom: 10px;">
                  <span class="title" @click="order = '-1'" :class="{ active: order === '-1' }">热门</span>
                </li>
                <li class="tab" v-for="item in list" :key="item" style="margin-bottom: 10px;">
                  <span class="title" @click="order = item[0]" :class="{ active: order === item[0] }">{{item[1]}}</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="list">
            <div class="list-item" v-for="item in singerList" :key="item.id" @click="toDetailList(item.id)">
              <div class="img-wrap">
                <img :src="item.img1v1Url+'?param=200y200'" alt="" />
              </div>
              <p class="name">{{ item.name }}</p>
            </div>
          </div>
          <div style="width:100%;height:50px;margin: 20px auto 0;text-align:center;">
            <span class="button" @click="pageNum++">查看更多</span>
          </div>
        </div>
      </el-scrollbar>
  </div>
</template>

<script>
import api from '@/api/index.js'
export default {
  data(){
    return{
      loading:true,
      pageNum:1,
      pageSize:30,
      total:0,
      singerList:[],
      list:[
        'aA','bB','cC','dD',
        'eE,','fF','gG','hH',
        'iI','jJ','kK','lL',
        'mM','nN','oO','pP',
        'qQ','rR','sS','tT',
        'uU','vV','wW','xX',
        'yY','zZ'
      ],
      area: '-1',
      type: '-1',
      order: '-1',
    }
  },
  created(){
    this._getSingerList()
  },
    watch: {
    area() {
      this.singerList=[]
      this._getSingerList()
    },
    type() {
      this.singerList=[]
      this._getSingerList()
    },
    order() {
      this.singerList=[]
      this._getSingerList()
    },
    pageNum(){
      this._getSingerList()
    }
  },
  methods:{
    async _getSingerList(){
      this.loading=true
      const {data:res} =await api.getSingerList({
        type:parseInt(this.type),
        area:parseInt(this.area),
        initial: this.order,
        offset:(this.pageNum - 1) * this.pageSize
      })
      console.log(res)
      this.singerList=this.singerList.concat(res.artists)
      this.loading=false
    },
    toDetailList(id){
      this.$router.push(`/singerdetail?id=${id}`)
    }
  }
}
</script>
<style scoped lang="scss">
@import "@/assets/css/global.scss";
.singer-container{
  padding: 20px;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  color:$fontColor;
  background-color: $bodyColor;
  .filter-wrap {
    & > div {
      margin-bottom: 30px;
      vertical-align: baseline;
      display: flex;
      align-items: center;
      span {
        font-size: 14px;
        height: 100%;
      }
      .title {
        color: gray;
        font-size: 12px;
        cursor: pointer;
        padding: 5px 20px;
        &::before {
          content: '', pos;
        }
      }
      .active {
        color: #ec4141;
        margin: 0 10px;
        background-color: $hoverColor;
        border-radius: 20px;
      }
      ul {
        display: flex;
        width:calc(100% - 30px);
        flex-flow:row wrap;
        li{
          &:not(:last-child) {
            border-right: 1px solid $hoverColor;
          }
        }
      }
    }
  }
  .list{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .list-item{
      width: 16%;
      max-width: 200px;
      min-width: 100px;
      padding: 10px;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      .img-wrap{
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
  .button{
    font-size: 12px;
    color:$fontColor;
    cursor: pointer;
  }
}
</style>