<template >
  <div class="top-container">
    <div class="top-img">
      <span style="cursor:pointer" @click="toHomeClick">Zy音乐盒</span>
    </div>
    <div class="top-btn">
      <div class="btn">
        <i class="iconfont icon-zuoyou1" @click="prev"></i>
      </div>
      <div class="btn">
        <i class="iconfont icon-zuoyou" @click="next"></i>
      </div>
    </div>
    <div class="top-search">
      <el-input
        placeholder="请输入内容"
        size="small"
        v-model="searchKey"
        @change="toResult"
        >
        <i slot="prefix" @click="toResult" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <div class="top-theme">
      <i class="iconfont" :class="{'icon-icon-test':0==current,'icon-yinle2':0!=current}" @click="changetheme(0)"></i>
      <i class="iconfont" :class="{'icon-icon-test':1==current,'icon-yinle2':1!=current}" @click="changetheme(1)"></i>
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
    toResult() {
      if (this.searchKey === '') {
        // 提示用户
        this.$message.warning('请输入内容!')
      } else {
        // 携带数据去搜索页面
        this.$router.push(`/result?q=${this.searchKey}`)
      }
    },
    changetheme(index){
      this.current=index
      if(index==0){
        document.getElementsByTagName('body')[0].style.setProperty('--myBgColor', '#EC4141')
        document.getElementsByTagName('body')[0].style.setProperty('--myFontColor', '#373737')
        document.getElementsByTagName('body')[0].style.setProperty('--mythemeColor', '#2B2B2B')
        document.getElementsByTagName('body')[0].style.setProperty('--myBodyColor', '#fff')
        document.getElementsByTagName('body')[0].style.setProperty('--myhoverColor', '#f5f5f5')
        document.getElementsByTagName('body')[0].style.setProperty('--myPlayBgcColor', '#f5f5f5')
      }else if(index==1){
        document.getElementsByTagName('body')[0].style.setProperty('--myBgColor', '#2B2B2B')
        document.getElementsByTagName('body')[0].style.setProperty('--myFontColor', '#b6b6b6')
        document.getElementsByTagName('body')[0].style.setProperty('--mythemeColor', '#EC4141')
        document.getElementsByTagName('body')[0].style.setProperty('--myBodyColor', '#2B2B2B')
        document.getElementsByTagName('body')[0].style.setProperty('--myhoverColor', '#333')
        document.getElementsByTagName('body')[0].style.setProperty('--myPlayBgcColor', '#222225')
      }
    },
    prev(){
      this.$router.go(-1)
    },
    next(){
      this.$router.go(1)
    },
    toHomeClick() {
      if ('/discovery' === this.$route.path) {
        return
      }
      this.$router.push(`/discovery`)
    },
  }
}
</script>

<style scoped lang="scss">
</style>