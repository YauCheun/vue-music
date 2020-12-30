<template>
  <div style="height:100%;width:100%"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.3)">
  <el-scrollbar style="height:100%">
  <div class="mvs-container">
    <div class="filter-wrap">
      <div class="seciton-wrap">
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab"><span class="title" @click="area = '全部'" :class="{ active: area === '全部' }">全部</span></li>
          <li class="tab"><span class="title" @click="area = '内地'" :class="{ active: area === '内地' }">内地</span></li>
          <li class="tab"><span class="title" @click="area = '港台'" :class="{ active: area === '港台' }">港台</span></li>
          <li class="tab"><span class="title" @click="area = '欧美'" :class="{ active: area === '欧美' }">欧美</span></li>
          <li class="tab"><span class="title" @click="area = '日本'" :class="{ active: area === '日本' }">日本</span></li>
          <li class="tab"><span class="title" @click="area = '韩国'" :class="{ active: area === '韩国' }">韩国</span></li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" @click="type = '全部'" :class="{ active: type === '全部' }">全部</span>
          </li>
          <li class="tab">
            <span class="title" @click="type = '官方版'" :class="{ active: type === '官方版' }">官方版</span>
          </li>
          <li class="tab">
            <span class="title" @click="type = '原声'" :class="{ active: type === '原声' }">原声</span>
          </li>
          <li class="tab">
            <span class="title" @click="type = '现场版'" :class="{ active: type === '现场版' }">现场版</span>
          </li>
          <li class="tab">
            <span class="title" @click="type = '网易出品'" :class="{ active: type === '网易出品' }">网易出品</span>
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span class="title" @click="order = '上升最快'" :class="{ active: order === '上升最快' }">上升最快</span>
          </li>
          <li class="tab">
            <span class="title" @click="order = '最热'" :class="{ active: order === '最热' }">最热</span>
          </li>
          <li class="tab">
            <span class="title" @click="order = '最新'" :class="{ active: order === '最新' }">最新</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- mv容器 -->
    <div class="mvs">
      <div class="items">
        <div class="item" @click="toMv(item.id)" v-for="(item, index) in mvs" :key="index">
          <div class="img-wrap">
            <img :src="item.cover+'?param=250y150'" alt="" />
            <div class="num-wrap">
              <div class="iconfont icon-bofang1 icon-play"></div>
              <div class="num">{{ item.playCount | playNumFormat }}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{ item.name }}</div>
            <div class="singer">{{ item.artistName }}</div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="pageSize">
      </el-pagination>
    </div>
    </div>
  </el-scrollbar>
  </div>
</template>

<script>
import api from '@/api/index.js'

export default {
  name: 'mvs',
  data() {
    return {
      // 总条数
      loading:true,
      total: 20,
      // 页码
      pageNum: 1,
      pageSize: 32,
      area: '全部',
      type: '全部',
      order: '最热',
      mvs: []
    }
  },

  created() {
    this._getMvs()
  },

  watch: {
    area() {
      this.pageNum = 1
      this._getMvs()
    },
    type() {
      this.pageNum = 1
      this._getMvs()
    },
    order() {
      this.pageNum = 1
      this._getMvs()
    }
  },

  methods: {
    // 页码改变事件
    handleCurrentChange(val) {
      // 保存页码
      this.pageNum = val
      this._getMvs()
    },

    async _getMvs() {
      this.loading=true
      const { data: resp } = await api.getMvs({
        area: this.area,
        type: this.type, 
        order: this.order,
        limit: this.pageSize,
        offset: (this.pageNum - 1) * this.pageSize
      })
      if (resp.count) {
        this.total = resp.count
      }
      this.mvs = resp.data
      this.loading=false
    },
    toMv(id) {
      this.$router.push(`/mvdetail?id=${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/global.scss";
.mvs-container {
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
        li{
          &:not(:last-child) {
            border-right: 1px solid #f2f2f1;
          }
        }
      }
    }
  }
  .mvs {
    .items {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .item {
        width: 250px;
        cursor: pointer;
        margin-right: 25px;
        margin-bottom: 30px;
        .img-wrap {
          width: 100%;
          position: relative;
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
        }
        .info-wrap {
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
</style>
