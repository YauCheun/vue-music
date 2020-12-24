<template>
  <div class="control-box">
    <div class="singer-info">
      <div class="img" @click="showMusicBox=!showMusicBox">
        <div class="wrap-mask">
          <i class="iconfont icon-fangda"></i>
        </div>
        <img :src="getImgUrl" alt="">
      </div>
      <div class="info">
        <p class="singe-name">
          {{this.$store.state.song.name}}
        </p>
        <p class="song-name">
        {{this.$store.state.song.author}}
        </p>
      </div>
    </div>
    <div class="control-progress">
      <div class="ctrl-btn">
        <span class="iconfont icon-suiji" v-if="clickModel%3==0" @click="changeModel"></span>
        <span class="iconfont icon-liebiaoxunhuan" v-else-if="clickModel%3==1" @click="changeModel"></span>
        <span class="iconfont icon-danquxunhuan" v-else="clickModel%3==2" @click="changeModel"></span>
        <span class="iconfont icon-shangyishou3" @click="prev"></span>
        <span class="iconfont icon-zanting play-stop" v-if="!isPlay" @click="pauseMusic"></span>
        <span class="iconfont icon-bofang5 play-stop" v-else @click="playMusic"></span>
        <span class="iconfont icon-xiayishou1" @click="next"></span>
        <span class="iconfont icon-ci-copy" @click="showLyric=!showLyric" :class="{'hover-color':showLyric}"></span>
      </div>
      <div class="progress">
        <span style="text-align:left">{{currentTime | formDate}}</span>
        <div class="slider">
          <el-slider v-model="progressVal"  :show-tooltip="false" @change="changeProgress"></el-slider>
        </div>
        <span>{{duration | formDate}}</span>
      </div>
    </div>
    <div class="control-btn">
      <div class="voice">
        <span class="iconfont icon-shengyin"></span>
        <ul>
          <li v-for="index in voice" :key="index" :class="{'is-active':curVoice>=index}" @click="changeVoice(index)"></li>
        </ul>
      </div>
      <div class="play-list">
        <span class="iconfont icon-yinle-liebiao" @click="isShowPlayList=true"></span>
      </div>
    </div>
    <el-drawer
      title="播放列表"
      v-if="isShowPlayList"
      :visible.sync="isShowPlayList"
      :with-header="false"
      :modal="false"
      :modal-append-to-body="false"
    >
    <div class="list">
      <div class="list-head">
        <div class="title">
          <p>播放列表</p> 
        </div>
        <div class="show-btn">
          <span class="total">总{{ this.$store.state.list.length }}首</span>
          <span class="del" @click="deleteAll"><i class="iconfont icon-lajixiangzizhi"></i>清空</span>
        </div>
      </div>
      <el-scrollbar style="height:100%">
        <el-table
          :data="this.$store.state.list"
          size="mini"
          stripe
          @row-click="onClick"
          :show-header="false"
          style="width: 100%"
        >
          <el-table-column
            label="歌名"
            align="center"
            >
            <template slot-scope="scope">
              <div style=" display: flex;align-items: center;">
                <div v-if="scope.$index==$store.state.index" style="display:inline-block;width:14px;height:100%;">
                  <img src="../assets/images/dh.gif" alt="">
                </div>
                <span style="width:100%;display: inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">{{scope.row.name}}</span> 
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            align="center"
            label="歌手">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="80"
            >
            <template slot-scope="scope">
              <div style="text-align:center;" @click.stop="deleteSong(scope.$index)">
                <span class="iconfont icon-lajixiangzizhi" style="cursor: pointer;" ></span> 
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
    </div>
    
    </el-drawer>
    <audio id="myaudio" ref="myaudio" :src="getMusicUrl"></audio>
    <div class="lyric" v-show="showLyric">
      <p>{{ lyric }}</p>
    </div>
    <transition name="slide">
      <div class="musicbox" v-show="showMusicBox">

      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
export default {
  data(){
    return{
      val:'', //歌曲信息
      progressVal:0,//进度条
      voice:[1,2,3,4,5,6,7,8,9,10],
      curVoice:5, //当前音量值
      isShowPlayList:false,
      currentTime:0,
      showLyric:true,
      lyric:"",
      currentIndex: 0,
      showMusicBox:true,
      isPlay:true, //播放状态
      duration:'00',//歌曲总秒数
      clickModel:1, //播放模式 1：列表循环 2：单纯循环 0：随机
      tableData:[
        {
          name:11,
          singerName:22
        },
        {
          name:11,
          singerName:22
        },
        {
          name:11,
          singerName:22
        }
      ]
    }
  },
  filters: {
    formDate(date) {
      //格式化时间过滤器
      var m = parseInt(date / 60)
      if (m < 10) {
        m = "0" + m
      }
      var s = parseInt(date % 60)
      if (s < 10) {
        s = "0" + s
      }
      return m + ":" + s
    },
  },
  mounted(){
    let audio = this.$refs.myaudio
    audio.volume=this.curVoice/10
    //监听音频是否可以开始播放
    audio.addEventListener("canplay", () => {
      this.val = this.getName + " — " + this.getAuthor
      this.$store.commit("upDateStatus", this.$store.state.song.songName)
      this.duration = audio.duration
    })
      // 监听歌曲是否已经播放结束
    audio.addEventListener("ended", () => {
      if (this.clickModel % 3 == 2) {
        //当播放模式是循环时
        audio.load()
        audio.setAttribute("autoplay", "autoplay")
      } else {
        this.$store.commit("next", { model: this.clickModel })
      }
    })
    audio.addEventListener("play", () => {
      // document.title = this.$store.state.song.name
      // links.setAttribute("href", this.getImgUrl)
      //播放状态
      this.isPlay = false
    })
    audio.addEventListener("pause", () => {
      //暂停状态
      this.isPlay = true
    })
     // 监听音频播放位置的改变
    audio.addEventListener("timeupdate", () => {
      this.currentTime=audio.currentTime
      this.progressVal=(this.currentTime/this.duration)*100
      if(this.$store.state.song.lyric.length){
        let lyricArray = this.$store.state.song.lyric
        let length = lyricArray.length
        //遍历所有歌词
        //最后一句歌词没有下一句,所以不需要跟下一句的时间做比较
        if (this.currentIndex == length - 2) {
          //判断当前的时间是否大于等于最后一句的时间
          if (this.currentTime >= lyricArray[length - 1][0]) {
            //正在唱最后一句
            this.currentIndex = length - 1
            this.lyric = lyricArray[length - 1][1]
          }
        } else {
          for (var i = 0; i < length - 1; i++) {
            //将每个歌曲进度都跟数组中的歌词比较,在当前歌词的时间到下一句歌词的时间范围之内
            if (
              this.currentTime >= lyricArray[i][0] &&
              this.currentTime < lyricArray[i + 1][0]
            ) {
              //设置正在播放的行号
              this.currentIndex = i
              this.lyric = lyricArray[i][1]
              console.log(this.lyric)
            }
          }
        }
      }else{
        this.lyric="暂无歌词"
      }
    })
  },
  computed:{
    ...mapGetters([
      "getName",
      "getAuthor",
      "getMusicUrl",
      "getImgUrl",
      "getIndex",
    ])
  },
  methods:{
    //改变音量
    changeVoice(index){
      this.curVoice=index
      var audio = this.$refs.myaudio
      audio.volume=this.curVoice/10
    },
    changeModel(){
      this.clickModel++
    },
    //播放音乐
    playMusic(){
      if (this.$store.state.list.length == 0) {
        this.$message({
          message: "暂无播放列表,请去音乐库里选择要播放的音乐",
          type: "warning",
        })
      } else {
        var audio = this.$refs.myaudio
        audio.play()
      }
    },
    //暂停音乐
    pauseMusic(){
      var audio = this.$refs.myaudio
      audio.pause()
    },
    //上一首
    prev(){
      this.$store.commit("prev",{model:this.clickModel})
    },
    //下一首
    next(){
      this.$store.commit("next",{model:this.clickModel})
    },
    //点击切换切换歌曲
    onClick(data){
      this.$store.dispatch("getSong",{id:data.id,autoPlay:true})
    },
    // 清空播放列表
    deleteAll(){
      this.$store.commit("deleteAll")
      this.pauseMusic()
    },
    //从列表删除歌曲
    deleteSong(index){
      if(index===this.$store.state.index){
        this.pauseMusic()
      }
      this.$store.commit("deleteSong",index)
    },
    changeProgress(val){
      var audio = this.$refs.myaudio
      audio.currentTime = val/100*this.duration
    }
  }
}
</script>


<style lang="scss">
@import "@/assets/css/global.scss";
  .progress{
    .el-slider .el-slider__runway{
      margin: 0;
      margin-top:5px;
      height:3px;
      border-radius: 1px;
      &:hover .el-tooltip.el-slider__button{
        opacity: 1;
      }
      .el-slider__bar{
        background-color: #EC4141;
        height:3px;
      }
      .el-slider__button-wrapper{
        top:-16px;
      }
      .el-tooltip.el-slider__button{
        width:8px;
        height:8px;
        opacity: 0;
        background-color:  #EC4141;
        border:none;
      }
    }
  }
  .control-box{
    .el-drawer__open .el-drawer.rtl{
      height: calc(100% - 125px);
      margin-top:55px;
      min-width: 240px;
      background-color: $bodyColor;
      color:$fontColor;
    }
  }
</style>
<style lang="scss" scoped>
@import "@/assets/css/global.scss";
.slide-enter-active {
  animation-name: slideInUp;
  animation-duration: 0.2s;
  transform-origin:0 100%;
  animation-fill-mode: both;
}
.slide-leave-active {
  animation-name: slideOutDown;
  transform-origin:0% 100%;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}
@keyframes slideInUp {
  0% {
    transform: scale(0);
    visibility: visible;
  }
  to {
    transform: scale(1);
  }
}
@keyframes slideOutDown {
  0% {
    transform: scale(1);
  }
  to {
    visibility: hidden;
    transform: scale(0);
  }
}
.delay-leave-active {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  -o-animation-delay: 0.2s;
  animation-delay: 0.2s;
}
.control-box{
  height:70px;
  display: flex;
  flex-direction: row;
  width:100%;
  position: relative;
  background-color: $playBgcColor;
  .musicbox{
    position:fixed;
    z-index: 9999;
    left:0;
    top:55px;
    right: 0;
    bottom: 0;
    height: calc(100% - 125px);
    background-color: pink;
  }
  .lyric{
    width:50%;
    position: absolute;
    bottom: 200px;
    left: 50%;
    transform: translateX(-50%);
    p{
      text-align: center;
      word-break:break-word;
      word-break:break-all;
      font: 700 26px "Comic Sans MS";
      color: rgb(49, 221, 233);
      text-shadow: 0 0 10px #9ff7c6,
            5px -5px 10px #83d19d,
            5px -5px 10px #8dd5eb,
            -5px -15px 12px #7ddbb4
    }
  }
  .singer-info{
    height: 100%;
    width:200px;
    padding:10px;
    display: flex;
    flex-direction: row;
    .img{
      cursor: pointer;
      width:50px;
      height:50px;
      position: relative;
      img{
        width:50px;
        height:50px;
        border-radius: 5px;
      }
      .wrap-mask{
        height:100%;
        width:100%;
        position: absolute;
        opacity: 0;
        .iconfont{
          box-sizing: border-box;
          width:50px;
          height: 50px;
          display: inline-block;
          padding:7px 0 0 7px;
          font-size: 36px;
          color: #fff;
          font-weight: lighter;
        }
      }
      &:hover .wrap-mask{
        border-radius: 5px;
        opacity: 0.8;
        background: rgba(0,0,0,.4);
      }
    }
    .info{
      width: 130px;
      height:100%;
      padding-top:5px;
      padding-left: 20px;
      color:$fontColor;
      .singe-name{
        font-size: 15px;
        line-height: 22px;
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换
      }
      .song-name{
        line-height: 22px;
        font-size: 13px;
        overflow:hidden; //超出的文本隐藏
        text-overflow:ellipsis; //溢出用省略号显示
        white-space:nowrap; //溢出不换
      }
    }
  }
  .control-progress{
    height: 100%;
    width: 50%;
    display: flex;
    padding:5px;
    flex-direction: column;
    justify-content:center;
    margin: 0 auto;
    .ctrl-btn{
      height:35px;
      width:230px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 0 auto;
      .play-stop{
        color:$fontColor;
        width:30px;
        height:30px;
        box-sizing: border-box;
        border-radius: 50%;
        background-color: $hoverColor;
        padding: 5px 0 0 5px;
        &:hover{
          background-color: #d3d3d3;
          color: #000;
        }
      }
      span{
        color:$fontColor;
        font-size: 20px;
        cursor: pointer;
        &:hover{
          color: #EC4141;
        }
      }
      .hover-color{
        color: #EC4141;
      }
    }
    .progress{
      height:20px;
      width:100%;
      display: flex;
      flex-direction: row;
      span{
        color:$fontColor;
        width: 25px;
        font-size: 14px;
      }
      .slider{
        width:calc(100% - 70px);
        margin: 0 10px;
        padding-top:1px;
      }
    }
  }
  .control-btn{
    height: 100%;
    width:200px;
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;
    justify-content:space-between;
    .voice{
      height:100%;
      display: flex;
      align-items: center;
      span{
        font-size: 18px;
        margin-right:6px;
        color:$fontColor;
      }
      ul{
        width: 70px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: distribute;
        justify-content: space-around;
        li{
          list-style: none;
          width: 4px;
          cursor: pointer;
          height: 12px;
          background: $bodyColor;
          border-radius: 2px
        }
        .is-active{
          background-color: #EC4141;
        }
      }
    }
    .play-list{
      display: flex;
      align-items: center;
      span{
        color:$fontColor;
        cursor: pointer;
        font-size: 20px;
      }
    }
  }
  .list{
    background-color: $bodyColor;
    color:$fontColor;
    .list-head{
      .title{
        text-align: center;
        height:32px;
        width:100%;
        line-height: 32px;
        margin: 5px auto;
        background-color: $hoverColor;
      }
      .show-btn{
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        padding:0 10px;
        margin: 5px 0;
        align-items: center;
        .total{
          color:$themeColor;
        }
        .del {
          cursor: pointer;
          .iconfont{
            margin-right: 6px;
          }
        }
      }
    }
    .del,.iconfont.icon-lajixiangzizhi{
      &:hover{
        color:#EC4141;
      }
    }
  }

}
</style>