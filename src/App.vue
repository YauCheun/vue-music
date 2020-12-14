<template>
  <div id="app">
    <top></top>
    <container></container>
    <play></play>
  </div>
</template>

<script>
import top from '@/component/top'
import container from '@/component/container'
import play from '@/component/play'
export default {
  name: 'App',
  components:{top,container,play},
  mounted(){
    let musicInfo =JSON.parse(window.localStorage.getItem("musicState"))
    if(musicInfo){
      this.$store.commit("pushlist",musicInfo)
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/css/init_common.scss";
@import "@/assets/css/index.scss";
#app{
  height: 100%;
  width: 100%;
}
</style>