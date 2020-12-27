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
        <div class="content-box">
          <el-scrollbar style="height:100%">
            <div class="song-info">
              <div class="left">
                <div class="img isRotate" ref="imgRotate">
                  <img :src="getImgUrl" alt="">
                </div>
              </div>
              <div class="right">
                <div class="header">
                  <div class="title">
                    {{ this.$store.state.song.name}} <span>标准音质</span>
                  </div>
                  <div class="info">
                    <span>
                      专辑：<font>{{ this.$store.state.song.album}}</font>
                    </span>
                    <span style="margin-left:30px;">
                      歌手：<font>{{ this.$store.state.song.author }}</font>
                    </span>
                  </div>
                </div>
                <div class="content">
                  <el-scrollbar style="height:100%;" ref="scroll">
                    <ul  v-if="this.$store.state.song.lyric.length">
                      <li
                        v-for="item,index in this.$store.state.song.lyric"
                        :key="item[0]"
                        :class="{'active':currentIndex==index}"
                      >
                      {{item[1]}}
                      </li>
                    </ul>
                    <ul v-else> 
                      <li  class="active">暂无歌词</li>  
                    </ul>
                  </el-scrollbar>
                </div>
              </div>
            </div>
            <div class="song-comment">
              <!-- 精彩评论 -->
              <div class="comment-wrap" v-if="hotComments !== undefined && hotComments.length !== 0">
                <p class="title">
                  精彩评论<span class="number">({{ hotComments.length }})</span>
                </p>
                <div class="comments-wrap">
                  <!-- 评论 -->
                  <div class="item" v-for="(item, index) in hotComments" :key="index">
                    <div class="icon-wrap">
                      <!-- 头像 -->
                      <img :src="item.user.avatarUrl+'?param=50y50'" alt="" />
                    </div>
                    <div class="content-wrap">
                      <div class="content">
                        <span class="name">{{ item.user.nickname }}</span>
                        <span class="comment">：{{ item.content }}</span>
                      </div>
                      <!-- 回复 -->
                      <div class="re-content" v-if="item.beReplied.length !== 0">
                        <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                        <span class="comment">：{{ item.beReplied[0].content }}</span>
                      </div>
                      <div class="date">{{ item.time | dateFormat }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 最新评论 -->
              <div class="comment-wrap">
                <p class="title">
                  最新评论<span class="number">({{ total }})</span>
                </p>
                <div class="comments-wrap">
                  <!-- 评论 -->
                  <div class="item" v-for="(item, index) in comments" :key="index">
                    <div class="icon-wrap">
                      <!-- 头像 -->
                      <img :src="item.user.avatarUrl+'?param=50y50'" alt="" />
                    </div>
                    <div class="content-wrap">
                      <div class="content">
                        <span class="name">{{ item.user.nickname }}</span>
                        <span class="comment">：{{ item.content }}</span>
                      </div>
                      <!-- 回复 -->
                      <div class="re-content" v-if="item.beReplied.length !== 0">
                        <span class="name">{{ item.beReplied[0].user.nickname }}</span>
                        <span class="comment">：{{ item.beReplied[0].content }}</span>
                      </div>
                      <div class="date">{{ item.time | dateFormat }}</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 分页器 -->
              <el-pagination @current-change="handleCurrentChange" background layout="prev, pager, next" :total="total" :current-page="pageNum" :page-size="pageSize">
              </el-pagination>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import api from "@/api/index.js"
export default {
  data(){
    return{
      val:'', //歌曲信息
      progressVal:0,//进度条
      voice:[1,2,3,4,5,6,7,8,9,10],
      curVoice:5, //当前音量值
      isShowPlayList:false,
      currentTime:0,
      scrolltop:0, //滚动条位置
      isScroll:false, //是否手动滚动歌词滚动条
      showLyric:true,
      lyric:"",
      currentIndex: 0,
      showMusicBox:false,
      isPlay:true, //播放状态
      duration:'00',//歌曲总秒数
      clickModel:1, //播放模式 1：列表循环 2：单纯循环 0：随机
      pageSize:20,
      pageNum:1,
      total:0,
      comments:[],//评论
      hotComments:[] //热门评论
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
    let state = this.$refs.imgRotate.style['animationPlayState']
    this.$refs.imgRotate.style['animationPlayState'] = 'paused'; 
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
      let state = this.$refs.imgRotate.style['animationPlayState']
      this.$refs.imgRotate.style['animationPlayState'] = 'running'; 
    })
    audio.addEventListener("pause", () => {
      //暂停状态
      this.isPlay = true
      let state = this.$refs.imgRotate.style['animationPlayState']
      this.$refs.imgRotate.style['animationPlayState'] = 'paused'; 
    })
     // 监听音频播放位置的改变
    audio.addEventListener("timeupdate", () => {
      this.currentTime=audio.currentTime
      this.progressVal=(this.currentTime/this.duration)*100
      if(this.$store.state.song.lyric.length){
        let lyricArray = this.$store.state.song.lyric
        let length = lyricArray.length
        //遍历所有歌词
        //计算滚动条的位置
        if (this.currentIndex >= 4) {
          this.scrolltop = (this.currentIndex - 4) * 40
          if(!this.isScroll){
            this.$refs.scroll.wrap.scrollTop = this.scrolltop;//wrap 是源码中带的
          }
        }
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
    //监听歌词滚动条
    this.handleScroll()
    this.getMusicComments()
  },
  computed:{
    ...mapGetters([
      "getName",
      "getAuthor",
      "getMusicUrl",
      "getImgUrl",
      "getIndex",
    ]),
    isSongChange(){
      return this.$store.state.song.id
    }
  },
  watch:{
    isSongChange(){
      this.pageSize=20
      this.pageNum=1
      this.getMusicComments()
    }
  },
  methods:{
    //监听歌词滚动条
    handleScroll() {
      let scrollbarEl = this.$refs.scroll.wrap
      scrollbarEl.onscroll = () => {
        this.timeId&&clearTimeout(this.timeId)
        this.isScroll = true
        this.timeId=setTimeout(()=>{
          this.isScroll=false
        },5000)
      }
    },
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
    },
    // 获取歌曲评论
    async getMusicComments() {
      if(this.$store.state.song.id==''){
        return 
      }
      try {
        const res = await api.getMusicComments({
          id: this.$store.state.song.id,
          limit: this.pageSize,
          offset: (this.pageNum - 1) * this.pageSize
        })
        this.comments = res.data.comments
        this.hotComments =  res.data.hotComments
        this.total =  res.data.total
      } catch (error) {
        console.log(error)
        this.$message.error('获取歌曲评论失败')
      }
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getMusicComments()
    },
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
    .el-drawer__wrapper{
      z-index: 99999;
    }
    .el-drawer__open .el-drawer.rtl{
      height: calc(100% - 125px);
      margin-top:55px;
      min-width: 240px;
      background-color: $bodyColor;
      color:$fontColor;
    }
  }
  .musicbox{
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
  .content-box{
    // .content{
      .el-scrollbar__bar.is-vertical {
      width:0;
      }
    // }
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
  box-sizing: border-box;
  border-top: 1px solid #ccc;
  .musicbox{
    position:fixed;
    z-index: 2000;
    left:0;
    top:55px;
    right: 0;
    bottom: 0;
    height: calc(100% - 125px);
    background-color: $bodyColor;
    .content-box{
      width: 780px;
      height:100%;
      margin:0 auto;
      .song-info{
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .left{
          width: 50%;
          .isRotate{
            -webkit-animation: play 10s linear infinite;
            -moz-animation: play 10s linear infinite;
            animation: play 10s linear infinite;
            @-webkit-keyframes play{
                0%{-webkit-transform: rotate(0deg);}
                100%{transform: rotate(360deg);}
            }
            @-moz-keyframes play {
                0%{-moz-transform: rotate(0deg);}
                100%{transform: rotate(360deg);}
            }
            @keyframes play{
                0%{transform: rotate(0deg);}
                100%{transform: rotate(360deg);}
            }
          }
          .img{
            margin-top:30px;
            width:300px;
            height: 300px;
            background: url("../assets/images/singlecover.png");
            background-size: cover;
            padding: 50px;
            border-radius: 50%;
            img{
              width:200px;
              height: 200px;
              border-radius: 50%;
            }
          }
        }
        .right{
          width:50%;
          padding-top: 30px;
          .header{
            .title{
              color:$fontColor;
              font-size: 24px;
              line-height: 40px;
              span{
                font-size: 12px;
                color: #EC4141;
                border: 1px solid #EC4141;
                padding: 2px;
                border-radius: 2px;
              }
            }
            .info{
              color:$fontColor;
              font-size: 14px;
              span{
              line-height: 36px;
              }
              font{
                color:#507daf;
              }
            }
          }
          .content{
            width: 100%;
            height: 390px;
            ul{
              li{
                font-size: 12px;
                color:$fontColor;
                line-height: 40px;
              }
              .active{
                font-size: 20px;
                font-weight: bold;
                color: $themeColor;
              }
            }
          }
        }
      }
      .song-comment{
        width: 100%;
        margin: 0 auto;
        .comment-wrap{
          .title{
            font-size: 18px;
            .number{
              color:$fontColor;
              font-size: 18px;
            }
          }
          .comments-wrap{
            .item{
              display: flex;
              padding-top: 20px;
              &:not(:last-child){
                border-bottom: 1px solid#AEAEAE;
              }
              .icon-wrap{
                margin-right: 15px;
                cursor: pointer;
                img{
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                }
              }
              .date{
                color: #bebebe;
                font-size: 14px;
              }
              .content-wrap{
                padding-bottom: 20px;
                flex: 1;
                .name{
                  color: #517eaf;
                  font-size: 14px;
                  cursor: pointer;
                }
                .comment{
                  font-size: 14px;
                  color:$fontColor;
                }
                .content{
                  margin-bottom: 10px;
                }
                .re-content{
                  margin-bottom: 10px;
                  padding: 10px;
                  background-color:$hoverColor;
                  border-radius: 5px;
                }
              }
            }
          }
        }     
      }
    }
  }
  .lyric{
    width:50%;
    position: absolute;
    bottom: 200px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 3px;
    padding: 10px;
    &:hover{
      background: rgba(0,0,0,.1);
    }
    p{
      text-align: center;
      word-break:break-word;
      word-break:break-all;
      font: 700 26px "Comic Sans MS";
      color: rgb(239, 243, 26);
      text-shadow: 0 0 5px #a5df73,
            2px -2px 5px #8ddf23,
            2px -2px 5px rgb(141, 172, 30),
            -2px -7px 5px #7ddbb4
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