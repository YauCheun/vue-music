<template>
  <div id="app">
    <top></top>
    <container></container>
  </div>
</template>

<script>
import top from '@/component/top'
import container from '@/component/container'
export default {
  name: 'App',
  components:{top,container}
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