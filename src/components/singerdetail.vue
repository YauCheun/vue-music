<template>
  <div
    style="height: 100%; width: 100%"
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.3)"
  >
    <el-scrollbar style="height: 100%">
      <div class="detail-container">
        <div class="top-wrap">
          <div class="img-wrap">
            <!-- 封面 -->
            <img :src="artist.picUrl" alt="" />
          </div>
          <div class="info-wrap">
            <!-- 名字 -->
            <p class="title">{{ artist.name }}</p>
            <p>
              <span>单曲数：{{ artist.musicSize }}</span>
              <span>专辑数：{{ artist.albumSize }}</span>
              <span>MV数：{{ artist.mvSize }}</span>
            </p>
            <div class="des">
              <p>{{ artist.briefDesc }}</p>
            </div>
          </div>
        </div>
        <el-tabs v-model="activeIndex" class="tabs">
          <el-tab-pane label="歌曲" name="单曲">
            <el-table :data="hotSongs" stripe style="width: 100%">
              <!-- <el-table-column
              align="center"
              prop="index"
              label="序号"
              width="50">
              <template slot-scope="scope">
                <span >{{scope.$index}}</span>
              </template>
            </el-table-column> -->
              <el-table-column label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <div class="img">
                    <img
                      :src="scope.row.picUrl + '?param=130y130'"
                      style="width: 50px"
                      alt=""
                    />
                    <i
                      class="iconfont icon-bofang5 play"
                      @click="playSong(scope.row)"
                    ></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="音乐标题"> </el-table-column>
              <el-table-column prop="singerName" label="歌手">
              </el-table-column>
              <el-table-column prop="zjName" label="专辑"> </el-table-column>
              <el-table-column prop="time" label="时长"> </el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="专辑" name="专辑">
            <div class="items">
              <div
                class="item"
                v-for="(item, index) in playlists"
                :key="index"
                @click="toPlaylist(item.id)"
              >
                <div class="img-wrap">
                  <img :src="item.picUrl + '?param=200y200'" alt="" />
                  <span class="iconfont icon-bofang5 icon-play"></span>
                </div>
                <p class="name">{{ item.name }}</p>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="MV" name="MV">
            <div class="items mv">
              <div
                class="item"
                v-for="(item, index) in mvs"
                :key="index"
                @click="toMv(item.id)"
              >
                <div class="img-wrap">
                  <img :src="item.imgurl + '?param=250y150'" alt="" />
                  <span class="iconfont icon-bofang5 icon-play"></span>
                  <div class="num-wrap">
                    <div class="iconfont icon-bofang1 icon-play"></div>
                    <div class="num">{{ item.playCount | playNumFormat }}</div>
                  </div>
                  <span class="time">{{ item.duration | playTimeFormat }}</span>
                </div>
                <div class="info-wrap">
                  <div class="name">{{ item.name }}</div>
                  <div class="singer">{{ item.artistName }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- 分页器 -->
        <!-- <el-pagination
          v-if="activeIndex != '单曲'"
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="pageNum"
          :page-size="pageSize"
        >
        </el-pagination> -->
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import api from "@/api/index.js";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      loading: true,
      id: "",
      artist: [],
      hotSongs: [],
      activeIndex: "单曲",
      playlists: [],
      mvs: [],
      total: 10,
      pageNum: 1, //当前页数
      pageSize: 10, //页面数量
    };
  },
  async created() {
    this.id = this.$route.query.id;
    await this.getArtists();
    // await this.getPlaylistComments()
    this.loading = false;
    //getDetailList
  },
  async activated() {
    if (!(this.id && this.$route.query.id == this.id)) {
      this.id = this.$route.query.id;
      this.loading = true;
      await this.getArtists();
      // await this.getPlaylistComments()
      this.loading = false;
    }
  },
  watch: {
    activeIndex() {
      switch (this.activeIndex) {
        case "单曲":
          this.pageNum = 1;
          this.getArtists();
          break;
        case "专辑":
          this.pageNum = 1;
          this.getAlbum();
          break;
        case "MV":
          this.pageNum = 1;
          this.getSingerMv()
          break;
        default:
          break;
      }
    },
  },
  methods: {
    ...mapActions(["getSong"]),
    playSong(row) {
      this.getSong({ id: row.id, autoPlay: true });
    },
    async getArtists() {
      this.loading = true;
      const { data: res } = await api.getArtists({ id: this.id });
      this.artist = res.artist;
      this.hotSongs = res.hotSongs;
      this.hotSongs.forEach((item) => {
        item.picUrl = item.al.picUrl;
        item.zjName = item.al.name;
        item.singerName = item.ar[0].name;
        item.time = this.$options.filters["playTimeFormat"](item.dt);
      });
      this.loading = false;
    },
    async getAlbum() {
      this.loading = true;
      const { data: res } = await api.getAlbum({ id: this.id });
      this.playlists = res.hotAlbums;
      this.loading = false;
    },
    async getSingerMv() {
      this.loading = true;
      const { data: res } = await api.getSingerMv({ id: this.id });
      this.mvs = res.mvs;
      this.loading = false;
    },
    // 页码改变事件
    handleCurrentChange(val) {
      // 保存页码
      this.pageNum = val;
    },
    toPlaylist(id) {
      this.$router.push(`/ablumlist?id=${id}`);
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/css/global.scss";
.detail-container {
  padding: 20px;
  width: 100%;
  // height: calc(100% - 55px);
  height: 100%;
  color: $fontColor;
  background-color: $bodyColor;
  .top-wrap {
    display: flex;
    span {
      font-size: 17px;
    }
    .img-wrap {
      margin-right: 30px;
      img {
        width: 200px;
        height: 200px;
        border-radius: 8px;
      }
    }
    .info-wrap {
      .title {
        margin-bottom: 10px;
        font-size: 24px;
        font-weight: 700;
        color: $fontColor;
      }
      p {
        span {
          font-size: 14px;
        }
      }
      .des {
        margin-top: 8px;
        p {
          font-size: 12px;
          color: $fontColor;
          text-indent: 2em;
        }
      }
    }
  }
  .tabs {
    .el-tabs__item {
      color: $fontColor;
      &:hover {
        color: #409eff;
      }
    }
    .is-active {
      color: #409eff;
    }
    .el-table__body-wrapper {
      .img {
        width: 50px;
        height: 50px;
        position: relative;
        cursor: pointer;
        border-radius: 8px;
        img {
          border-radius: 8px;
        }
        .play {
          position: absolute;
          padding-top: 1px;
          box-sizing: border-box;
          padding-left: 1px;
          top: 12px;
          left: 12px;
          color: #ec4141;
          font-size: 12px;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
        }
      }
    }
    .items {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      .item {
        width: 200px;
        cursor: pointer;
        margin-right: 20px;
        margin-bottom: 20px;
        .img-wrap {
          width: 100%;
          position: relative;
          & > .icon-play {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 36px;
            height: 36px;
            color: #dd6d60;
            font-size: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.8);
            opacity: 0;
          }
          &:hover > .icon-play {
            opacity: 1;
          }
          img {
            width: 100%;
            border-radius: 5px;
          }
          .num-wrap {
            position: absolute;
            color: #fff;
            top: 0;
            right: 0;
            display: flex;
            align-items: center;
            font-size: 14px;
            padding-right: 5px;
            padding-top: 2px;
            .icon-play {
              font-size: 12px;
              display: flex;
              align-items: center;
              margin-right: 5px;
            }
          }
          .time {
            position: absolute;
            bottom: 5px;
            right: 5px;
            color: $fontColor;
            font-size: 15px;
          }
        }
        .name {
          font-size: 15px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .singer {
          font-size: 14px;
          color: $fontColor;
        }
        .item {
          width: 250px;
        }
      }
    }
  }
}
</style>
