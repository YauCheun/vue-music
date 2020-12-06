<template>
  <div class="audiobox">
    <div class="img" @click="golyrics">
      <img :src="getImgUrl" alt />
    </div>
    <div class="audioinfo">
      <div class="title">
        <span>{{ 111 }}</span>
        <span>{{ 222 }}</span>
      </div>
    </div>
    <div class="controlbox">
      <div class="control">
        <span class="el-icon-caret-left" @click="prevSong"></span>
        <span
          v-if="!isPlay"
          class="el-icon-video-pause"
          @click="pauseMusic"
        ></span>
        <span v-else class="el-icon-video-play" @click="palyMusic"></span>
        <span class="el-icon-caret-right" @click="nextSong"></span>
      </div>
      <div class="progress" @click="clickProgress" id="progress">
        <div class="curentTime" :style="{ width: cwidth }"></div>
        <div class="circle" :style="{ left: leftdis }"></div>
      </div>
      <div class="other">
        <div class="time">
          <span>{{ currentTime | formDate }}</span>
          <span>|</span>
          <span>{{ duration | formDate }}</span>
        </div>
      </div>
      <div class="model" @click="changeModel">
        <!-- <img
          v-if="clickModel % 3 == 1"
          src="./images/cm2_icn_loop@2x.png"
          alt=""
        />
        <img
          v-else-if="clickModel % 3 == 2"
          src="./images/cm2_icn_one@2x.png"
          alt=""
        />
        <img
          v-else-if="clickModel % 3 == 0"
          src="./images/cm2_icn_shuffle@2x.png"
          alt=""
        /> -->
      </div>
      <div class="lybox">
        <div
          class="lybtu"
          :class="isly ? 'lyactive' : ''"
          @click="isly = !isly"
        >
          词
        </div>
        <div class="lycont" v-if="isly">{{ val }}</div>
      </div>
      <div class="menu">
        <!-- 播放列表 -->
        <transition name="el-fade-in-linear">
          <div v-show="show" class="menulist">
            <div class="listitle">
              <span>播放列表：共 {{ 333 }} 首</span>
              <span class="el-icon-delete delete" @click="delall"></span>
            </div>
            <div class="scrollbox">
              <vue-scroll :ops="ops" ref="vs">
                <div
                  v-for="(item, index) in 6"
                  :key="index"
                  class="item"
                >
                  <span
                    class="name"
                    :class="getIndex == index ? 'active_color' : ''"
                    @click="playSong(index)"
                    >{{ item.name }}</span
                  >
                  <span
                    class="el-icon-delete delete"
                    @click="deleteSong(index)"
                  ></span>
                </div>
              </vue-scroll>
            </div>
            <img :src="getImgUrl" alt class="listbg" />
            <div class="listbg-mask"></div>
          </div>
        </transition>
        <!-- 播放列表图标 -->
        <span
          class="el-icon-tickets"
          @click="show = !show"
          :class="show ? 'lyactive' : ''"
        ></span>
      </div>
      <audio id="myaudio" :src="getMusicUrl"></audio>
    </div>
    <div class="bgbox">
      <img :src="getImgUrl" alt class="bg" />
      <div class="bg-mask"></div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
export default {
  data() {
    return {
      isly: false,
      val: "",
      show: false,
      cwidth: "0%",
      currentTime: "00",
      duration: "00",
      leftdis: "0px",
      isPlay: true,
      id: "",
      prowidth: null,
      clickModel: 1,
      currentIndex: 0,
      ops: {
        //vuescroll的配置
        vuescroll: {
          sizeStrategy: "percent",
          detectResize: true,
        },
        scrollPanel: {
          scrollingX: false,
        },
        rail: {},
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: false,
          keepShow: false,
          background: "#b3c0d1",
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: "6px",
          disable: false,
        },
      },
    }
  },
  // computed: {
  //   // vue辅助函数
  //   ...mapGetters([
  //     "getName",
  //     "getAuthor",
  //     "getMusicUrl",
  //     "getImgUrl",
  //     "getIndex"
  //   ]),
  // },
  // filters: {
  //   formDate(date) {
  //     //格式化时间过滤器
  //     var m = parseInt(date / 60)
  //     if (m < 10) {
  //       m = "0" + m
  //     }
  //     var s = parseInt(date % 60)
  //     if (s < 10) {
  //       s = "0" + s
  //     }
  //     return m + ":" + s
  //   },
  // },
  // mounted() {
  //   this.getProWidth()
  //   var audio = document.getElementById("myaudio")

  //   window.onresize = this.getProWidth

  //   //监听音频是否可以开始播放
  //   audio.addEventListener("canplay", () => {
  //     this.val = this.getName + " — " + this.getAuthor
  //     this.$store.commit("upDateStatus", this.$store.state.song.songName)
  //     this.duration = audio.duration
  //   })

  //   // 监听歌曲是否已经播放结束
  //   audio.addEventListener("ended", () => {
  //     if (this.clickModel % 3 == 2) {
  //       //当播放模式是循环时
  //       audio.load()
  //       audio.setAttribute("autoplay", "autoplay")
  //     } else {
  //       this.$store.commit("next", { model: this.clickModel })
  //     }
  //   })

  //   // 监听音频播放位置的改变
  //   audio.addEventListener("timeupdate", () => {
  //     this.currentTime = audio.currentTime
  //     this.cwidth = (this.currentTime / this.duration) * 100 + "%"
  //     this.leftdis =
  //       this.prowidth * (this.currentTime / this.duration) - 9 + "px"
  //     if (this.$store.state.song.lyric) {
  //       let lyricArray = this.$store.state.song.lyric
  //       let length = lyricArray.length
  //       if (length) {
  //         //获取歌词数字
  //         // //计算滚动条的位置
  //         if (this.currentIndex >= 8) {
  //           this.scrolltop = (this.currentIndex - 8) * 30
  //         }
  //         //遍历所有歌词
  //         //最后一句歌词没有下一句,所以不需要跟下一句的时间做比较
  //         if (this.currentIndex == length - 2) {
  //           //判断当前的时间是否大于等于最后一句的时间
  //           if (this.currentTime >= lyricArray[length - 1][0]) {
  //             //正在唱最后一句
  //             this.currentIndex = length - 1
  //             this.val = lyricArray[length - 1][1]
  //           }
  //         } else {
  //           for (var i = 0; i < length - 1; i++) {
  //             //将每个歌曲进度都跟数组中的歌词比较,在当前歌词的时间到下一句歌词的时间范围之内
  //             if (
  //               this.currentTime >= lyricArray[i][0] &&
  //               this.currentTime < lyricArray[i + 1][0]
  //             ) {
  //               //设置正在播放的行号
  //               this.currentIndex = i
  //               this.val = lyricArray[i][1]
  //             }
  //           }
  //         }
  //       }
  //     }
  //   })

  //   //获取link（ico）标签（为了修改成歌曲的图片）
  //   var links = document.getElementsByTagName("link")[0]

  //   audio.addEventListener("play", () => {
  //     document.title = this.$store.state.song.name
  //     links.setAttribute("href", this.getImgUrl)
  //     //播放状态
  //     this.isPlay = false
  //   })
  //   audio.addEventListener("pause", () => {
  //     document.title = "深的个人博客"
  //     links.setAttribute("href", "/logo.ico")
  //     //暂停状态
  //     this.isPlay = true
  //   })
  // },
  // methods: {
  //   formDate(date) {
  //     //格式化时间过滤器
  //     var m = parseInt(date / 60)
  //     if (m < 10) {
  //       m = "0" + m
  //     }
  //     var s = parseInt(date % 60)
  //     if (s < 10) {
  //       s = "0" + s
  //     }
  //     return m + ":" + s
  //   },
  //   // 跳转到歌词页
  //   golyrics() {
  //     if (this.getMusicUrl == "") {
  //       this.$notify({
  //         title: "警告",
  //         message: "暂无播放列表,请去音乐库里选择要播放的音乐",
  //         type: "warning",
  //       })
  //     } else {
  //       this.$router.push("/musichome/misiclyrics")
  //     }
  //   },
  //   // 获取滚动条的宽度
  //   getProWidth() {
  //     var progress = document.getElementById("progress")
  //     this.prowidth = parseInt(window.getComputedStyle(progress).width)
  //   },

  //   //通过点击控制进度
  //   clickProgress(e) {
  //     var audio = document.getElementById("myaudio")
  //     this.cwidth = (e.offsetX / this.prowidth) * 100 + "%"
  //     this.leftdis = e.offsetX - 9 + "px"
  //     audio.currentTime = parseInt((e.offsetX / this.prowidth) * this.duration)
  //   },

  //   // 点击播放列表
  //   playSong(index) {
  //     this.$store.commit("upDateIndex", index)
  //   },
  //   // 上一首
  //   prevSong() {
  //     this.$store.commit("prev", { model: this.clickModel })
  //   },

  //   // 下一首
  //   nextSong() {
  //     this.$store.commit("next", { model: this.clickModel })
  //   },

  //   // 播放按钮
  //   palyMusic() {
  //     if (this.$store.state.list.length == 0) {
  //       this.$notify({
  //         title: "警告",
  //         message: "暂无播放列表,请去音乐库里选择要播放的音乐",
  //         type: "warning",
  //       })
  //     } else {
  //       var audio = document.getElementById("myaudio")
  //       audio.play()
  //     }
  //   },

  //   // 暂停音乐
  //   pauseMusic() {
  //     var audio = document.getElementById("myaudio")
  //     audio.pause()
  //   },

  //   //删除播放列表里的歌曲
  //   deleteSong(index) {
  //     this.$store.commit("delete", index)
  //   },

  //   // 清空歌曲列表
  //   delall() {
  //     this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
  //       confirmButtonText: "确定",
  //       cancelButtonText: "取消",
  //       type: "warning",
  //     })
  //       .then(() => {
  //         this.$store.commit("deleteAll")
  //         this.$message({
  //           type: "success",
  //           message: "删除成功!",
  //         })
  //       })
  //       .catch(() => {
  //         this.$message({
  //           type: "info",
  //           message: "已取消删除",
  //         })
  //       })
  //   },

  //   // 点击更换播放模式
  //   changeModel() {
  //     this.clickModel++
  //   },
  // },
}
</script>
<style lang="scss" scoped>
.lyactive {
  color: rgb(98, 158, 218) !important;
}
.audiobox {
  user-select: none;
  height: 50px;
  width: 100%;
  display: flex;
  position: relative;
  .img {
    z-index: 1;
    width: 50px;
    height: 50px;
    border-radius: 5px;
    margin: 5px;
    margin-left: 20px;
    overflow: hidden;
    box-shadow: 0 0px 8px rgba(13, 13, 14, 0.5), 0 0 8px rgba(10, 16, 20, 0.5);
    img {
      height: 50px;
      width: 50px !important;
    }
  }
  .img:hover {
    cursor: pointer;
  }
  .audioinfo {
    z-index: 1;
    width: 150px;
    height: 100%;
    .title {
      span {
        height: 25px;
        line-height: 25px;
        display: inline-block;
        margin: 0px;
        padding: 0px;
        width: 140px;
        margin: 0px 5px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-shadow: 0 0px 5px rgba(13, 13, 14, 0.5),
          0 0 5px rgba(10, 16, 20, 0.5);
      }
      span:nth-child(1) {
        margin-top: 5px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: rgb(218, 214, 214);
      }
      span:nth-child(2) {
        font-size: 12px;
        color: rgb(245, 240, 240);
      }
    }
  }
  .controlbox {
    z-index: 1;
    display: flex;
    align-items: center;
    height: 60px;
    width: calc(100% - 230px);
    .control {
      display: flex;
      height: 60px;
      justify-content: center;
      align-items: center;
      width: 120px;
      span {
        font-size: 30px;
        width: 40px;
        transition: 0.3s;
        color: rgb(255, 255, 255);
        text-align: center;
      }
      span:hover {
        color: rgb(98, 158, 218);
        cursor: pointer;
      }
    }
    .progress {
      z-index: 1;
      height: 8px;
      width: calc(100% - 390px);
      margin: 0px 10px;
      background: rgb(214, 214, 213);
      border-radius: 4px;
      display: flex;
      position: relative;
      .curentTime {
        border-radius: 4px;
        height: 8px;
        background: rgb(98, 158, 218);
        width: 30%;
      }
      .circle {
        box-sizing: border-box;
        height: 18px;
        width: 18px;
        position: absolute;
        top: -4px;
        border: 2px solid white;
        border-radius: 50%;
        background: rgb(98, 158, 218);
      }
    }
    .progress:hover {
      cursor: pointer;
    }
  }
  .other {
    width: 120px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    .time {
      font-size: 14px;
      color: white;
      span:nth-child(2) {
        margin: 0px 10px;
      }
    }
  }
  .lybox {
    height: 60px;
    width: 50px;
    font-size: 18px;
    text-align: center;
    .lybtu {
      height: 60px;
      line-height: 60px;
      color: white;
    }
    .lybtu:hover {
      cursor: pointer;
    }
    .lycont {
      padding: 15px 20px;
      position: absolute;
      border-radius: 5px;
      font-size: 25px;
      top: -85px;
      left: 50%;
      text-align: center;
      transform: translateX(-50%);
      color: #ffffff;
      background: rgba(27, 103, 165, 0.7);
    }
  }
  .model {
    width: 50px;
    height: 60px;

    img {
      width: 50px;
      margin-top: 6px;
    }
  }
  .menu {
    z-index: 1;
    font-size: 25px;
    width: 50px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    position: relative;
    .menulist {
      position: absolute;
      border-radius: 5px;
      top: -390px;
      left: -215px;
      height: 380px;
      width: 250px;
      background: white;
      box-shadow: 0 10px 8px rgba(13, 13, 14, 0.2),
        0 0 8px rgba(10, 16, 20, 0.2);
      transition: 0.5s;
      overflow: hidden;
      .listitle {
        height: 40px;
        font-size: 17px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid rgb(255, 255, 255);
        position: relative;
        z-index: 5;
        span {
          z-index: 1;
          color: rgb(255, 255, 255);
          display: inline-block;
          height: 40px;
          line-height: 40px;
          padding: 0px 10px;
        }
        .delete:hover {
          color: #ad0a49;
        }
      }
      .scrollbox {
        height: calc(100% - 40px);
      }
      .item {
        z-index: 1;
        line-height: 30px;
        height: 30px;
        color: rgb(255, 255, 255);
        font-size: 14px;
        width: 250px;
        vertical-align: middle;
        .name {
          vertical-align: middle;
          padding: 0px 10px;
          display: inline-block;
          width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .active_color {
          color: #ad0a49;
        }
        .delete {
          vertical-align: middle;
          width: 30px;
          display: inline-block;
          height: 30px;
          line-height: 30px;
          text-align: center;
          padding-right: 10px;
        }
        .delete:hover {
          color: crimson;
        }
      }
      .item:hover {
        cursor: pointer;
        background: #629eda;
        color: white;
      }
      .listbg {
        height: 380px;
        position: absolute;
        top: 0px;
        // left: 0px;
        // -webkit-filter: blur(20px);
        // filter: blur(0px);
        left: 50%;
        transform: translateX(-50%);
      }
      .listbg-mask {
        height: 380px;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
    span {
      transition: 0.3s;
    }
    span:hover {
      cursor: pointer;
    }
  }
  .bgbox {
    height: 60px;
    width: 100%;
    overflow: hidden;
    position: absolute;
  }
  .bg {
    width: 100%;
    position: absolute;
    left: 0;
    top: -350px;
    right: 0;
    bottom: 0;
    z-index: 0;
    // -webkit-filter: blur(20px);
    // filter: blur(20px);
  }
  .bg-mask {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
  }
}
.active {
  color: white;
  background: #629eda;
}
.__vuescroll {
  z-index: 1;
}
</style>