<template>
  <div class="container">
  <!-- 导航区域 -->
    <div class="nav">
      <ul>
        <li>
          <router-link to="/discovery" >
            <span>
              <i class="iconfont icon-discover"></i>
              <i>发现音乐</i>
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/playlists" >
            <span>
              <i class="iconfont icon-tuijian2"></i>
              <i>推荐歌单</i>
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span>
              <i class="iconfont icon-zuixin3"></i>
              <i>最新音乐</i>
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/mvs" >
            <span>
              <i class="iconfont icon-mv1"></i>
              <i >最新MV</i>
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/ranking" >
            <span>
              <i class="iconfont icon-paihang1"></i>
              <i>排行榜</i>
            </span>
          </router-link>
        </li>
        <li>
          <router-link to="/singers" >
            <span>
              <i class="iconfont icon-geshou"></i>
              <i>歌手</i>
            </span>      
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 主体区域 -->
    <div class="main">
      <!-- exclude="detaillist" -->
      <keep-alive>
        <router-view></router-view>
      </keep-alive> 
    </div>
  </div>
</template>


<script>
export default {
    
}
</script>

<style lang="scss">
    
</style>