<template >
  <div class="top-container">
    <div class="top-img">
    </div>
    <div class="top-btn">
      <div class="btn">
        <i class="iconfont icon-zuoyou1"></i>
      </div>
      <div class="btn">
        <i class="iconfont icon-zuoyou"></i>
      </div>
    </div>
    <div class="top-search">
      <el-input
        placeholder="请输入内容"
        size="small"
        v-model="searchKey">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="top-theme">
      <i class="iconfont" :class="{'icon-icon-test':0==current,'icon-yinle2':0!=current}" @click="changetheme(0)"></i>
      <i class="iconfont" :class="{'icon-icon-test':1==current,'icon-yinle2':1!=current}" @click="changetheme(1)"></i>
      <i class="iconfont" :class="{'icon-icon-test':2==current,'icon-yinle2':2!=current}" @click="changetheme(2)"></i>
    </div>
  </div>
</template>

<script>
export default {
  name:'top',
  data() {
    return {
      searchKey:'',
      index:0,
      current:0
    }
  },
  methods: {
    changetheme(index){
      this.current=index
      if(index==0){
        document.getElementsByTagName('body')[0].style.setProperty('--myBgColor', '#c20c0c')
      }else if(index==1){
        document.getElementsByTagName('body')[0].style.setProperty('--myBgColor', '#333')
      }else{
        document.getElementsByTagName('body')[0].style.setProperty('--myBgColor', '#fff')
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>