<template>
  <view>
    <!-- 用户信息 开始 -->
    <view class="user_info">
      <view class="user_icon">
        <image :src="imgDetail.user.avatar" mode="widthFix"></image>
      </view>
      <view class="user_desc">
        <view class="user_name">{{ imgDetail.user.name }}</view>
        <view class="user_time">{{ imgDetail.cnTime }}</view>
      </view>
    </view>
    <!-- 用户信息 开始 -->

    <!-- 高清大图 开始 -->
    <view class="high_img">
      <swiper-action @swiperAction="swiperAction">
        <image mode="widthFix" :src="imgDetail.thumb"></image>
      </swiper-action>
    </view>
    <!-- 高清大图 结束 -->

    <!-- 点赞 开始 -->
    <view class="user_rank">
      <view class="rank">
        <text class="iconfont icon-zan">{{ imgDetail.rank }}</text>
      </view>
      <view class="user_collect">
        <text class="iconfont icon-shoucang">收藏</text>
      </view>
    </view>
    <!-- 点赞 结束 -->

    <!-- 专辑 开始 -->
    <view class="album_wrap" v-if="album.length">
      <!-- 标题 -->
      <view class="album_title">相关</view>
      <!-- 内容 -->
      <view class="album_list">
        <view class="album_item" v-for="item in album" :key="item.id">
          <view class="album_cover">
            <image mode="aspectFill" :src="item.cover"></image>
          </view>
          <!-- 右边 -->
          <view class="album_info">
            <view class="album_info_text">专辑</view>
            <view class="album_name">{{ item.name }}</view>
            <text class="iconfont icon-iconright"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 专辑 结束 -->

    <!-- 最热评论 comment hot -->
    <view class="comment hot" v-if="hot.length">
      <view class="comment_title">
        <text class="iconfont icon-hot1"></text>
        <text class="comment_text">最热评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in hot" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 用户头像 -->
            <view class="user_icon">
              <image mode="widthFix" :src="item.user.avatar"></image>
            </view>
            <!-- 用户名称 -->
            <view class="user_name">
              <view class="nickname">{{ item.user.name }}</view>
              <view class="user_time">{{ item.cnTime }}</view>
            </view>
            <!-- 用户徽章 -->
            <view class="user_badge">
              <image
                v-for="(item2, index) in item.user.title"
                :key="index"
                :src="item2.icon"
              ></image>
            </view>
          </view>
          <!-- 评论数据 -->
          <view class="comment_desc">
            <view class="comment_content">{{ item.content }}</view>
            <view class="comment_like">
              <text class="iconfont icon-zan">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 最新评论 comment new -->
    <view class="comment new" v-if="comment.length">
      <view class="comment_title">
        <text class="iconfont icon-pinglun"></text>
        <text class="comment_text">最新评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in comment" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 用户头像 -->
            <view class="user_icon">
              <image mode="widthFix" :src="item.user.avatar"></image>
            </view>
            <!-- 用户名称 -->
            <view class="user_name">
              <view class="nickname">{{ item.user.name }}</view>
              <view class="user_time">{{ item.cnTime }}</view>
            </view>
            <!-- 用户徽章 -->
            <view class="user_badge">
              <image
                v-for="(item2, index) in item.user.title"
                :key="index"
                :src="item2.icon"
              ></image>
            </view>
          </view>
          <!-- 评论数据 -->
          <view class="comment_desc">
            <view class="comment_content">{{ item.content }}</view>
            <view class="comment_like">
              <text class="iconfont icon-zan">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 下载图片开始 -->
    <view class="download">
      <view class="download_btn" @click="handleDownload">下载图片</view>
    </view>
    <!-- 下载图片结束 -->
  </view>
</template>

<script>
import moment from "moment";

import swiperAction from "../../components/swiperAction";
//  设置语言为中文
moment.locale("zh-cn");

export default {
  components: {
    swiperAction,
  },
  data() {
    return {
      //  图片信息对象
      imgDetail: {},
      //    专辑数据
      album: [],
      //    最热评论
      hot: [],
      //    最新评论
      comment: [],
      //    图片的索引
      imgIndex: 0,
    };
  },
  onLoad() {
    //  console.log(getApp().globalData);
    const { imgIndex } = getApp().globalData;
    this.imgIndex = imgIndex;
    this.getData();
  },
  methods: {
    getData() {
      const { imgList } = getApp().globalData;
      this.imgDetail = imgList[this.imgIndex];

      //    xx年前的数据
      this.imgDetail.cnTime = moment(this.imgDetail.atime * 1000).fromNow();

      //  获取图片id this.imgDetail.id
      this.getComments(this.imgDetail.id);
    },
    getComments(id) {
      this.request({
        url: `http://service.picasso.adesk.com/v2/wallpaper/wallpaper/${id}/comment`,
      }).then((res) => {
        //  console.log(res);
        this.album = res.res.album;

        //  给hot数组中的对象添加一个时间属性 xx月前
        res.res.hot.forEach((item) => {
          item.cnTime = moment(item.atime * 1000).fromNow();
        });
        res.res.comment.forEach((item) => {
          item.cnTime = moment(item.atime * 1000).fromNow();
        });
        this.hot = res.res.hot;
        this.comment = res.res.comment;
      });
    },
    //  滑动事件
    swiperAction(obj) {
      //    console.log(obj);
      const { imgList } = getApp().globalData;
      if (obj.direction === "right") {
        this.imgIndex++;
        if (this.imgIndex === imgList.length) this.imgIndex = 0;
        this.getData();
      } else {
        this.imgIndex--;
        if (this.imgIndex === 0) this.imgIndex = imgList.length - 1;
        this.getData();
      }
    },
    //  点击下载图片
    async handleDownload(){
      //  uni.downloadFile
      //  uni.saveImageToPhotosAlbum

      await uni.showLoading({
        title: '下载中...'
      })

      //  将远程文件下载到小程序中
      const res = await uni.downloadFile({url: this.imgDetail.img})
      const {tempFilePath} = res[1]

      //  将小程序内存中的临时文件下载到本地上
      const res2 = await uni.saveImageToPhotosAlbum({filePath:tempFilePath})
      //  console.log(res2);
      //  console.log('xiazaicg');
      //  提示下载成功
      uni.hideLoading()
      await uni.showToast({
        title: '下载成功'
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.user_info {
  display: flex;
  padding: 20rpx;
  .user_icon {
    padding: 0 20rpx;
    image {
      width: 88rpx;
      border-radius: 50%;
    }
  }

  .user_desc {
    .user_name {
      color: #000;
      font-weight: 600;
    }

    .user_time {
      color: #ccc;
      font-size: 24rpx;
      padding: 10rpx 0;
    }
  }
}

.user_rank {
  display: flex;
  height: 80rpx;
  border-bottom: 5rpx solid #eee;
  .rank {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    .iconfont {
    }
  }

  .user_collect {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    .iconfont {
    }
  }
}

.high_img {
  image {
    border-bottom: 1rpx solid #eee;
  }
}

.album_wrap {
  padding: 20rpx;
  .album_title {
    padding: 10rpx 0;
  }

  .album_list {
    .album_item {
      display: flex;
      padding: 10rpx 0;
      border-bottom: 10rpx solid #eee;
      .album_cover {
        flex: 1;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }

      .album_info {
        flex: 3;
        padding-left: 20rpx;
        position: relative;
        .album_info_text {
          width: 100rpx;
          height: 50rpx;
          background-color: $color;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .album_name {
          padding: 10rpx 0;
          color: #888;
        }
        .iconfont {
          font-size: 40rpx;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10%;
          color: #000;
        }
      }
    }
  }
}

.comment {
  .comment_title {
    padding: 15rpx;
    .iconfont {
      color: red;
      font-size: 40rpx;
    }

    .comment_text {
      font-weight: 600;
      font-size: 28rpx;
      color: #666;
      margin-left: 10rpx;
    }
  }

  .comment_list {
    .comment_item {
      //  用户信息
      border-bottom: 10rpx solid #eee;
      .comment_user {
        display: flex;
        padding: 20rpx 0;
        .user_icon {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;
          image {
            width: 90%;
          }
        }

        .user_name {
          flex: 1;
          .nickname {
            color: #777;
          }

          .user_time {
            color: #ccc;
            font-size: 24rpx;
            padding: 5rpx;
          }
        }

        .user_badge {
          image {
            width: 40rpx;
            height: 40rpx;
            display: inline-block;
          }
        }
      }

      //  评论数据
      .comment_desc {
        display: flex;
        padding: 30rpx 0;
        .comment_content {
          flex: 1;
          padding-left: 15%;
          color: #000;
        }

        .comment_like {
          text-align: right;
          .iconfont.icon-zan {
          }
        }
      }
    }
  }
}

.new {
  .icon-pinglun {
    color: aqua !important;
  }
}

//  下载图片
.download{
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  .download_btn{
    width: 95%;
    height: 80%;
    border-radius: 15rpx;
    background-color: $color;
    color: #fff;
    font-size: 50rpx;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>