<template>
  <view class="video_play">
    <!-- 背景开始 -->
    <image :src="videoObj.img"></image>
    <!-- 背景结束 -->

    <!-- 工具栏开始 -->
    <view class="video_tool">
      <text
        @click="handleMuted"
        :class="['iconfont', muted ? 'icon-jingyin' : 'icon-sheng_yin']"
      ></text>
      <view class="iconfont icon-zhuanfa"
        ><button open-type="share"></button
      ></view>
    </view>
    <!-- 工具栏结束 -->

    <!-- 视频开始 -->
    <view class="video_wrap">
      <video :muted="muted" :src="videoObj.video" objectFit="fill"></video>
    </view>
    <!-- 视频结束 -->

    <!-- 下载开始 -->
    <view class="download">
      <view class="download_btn" @click="handleDownload">下载高清</view>
    </view>
    <!-- 下载结束 -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      videoObj: {},
      //  是否静音
      muted: false,
    };
  },
  onLoad() {
    this.videoObj = getApp().globalData.video;
  },
  methods: {
    //  开关声音的点击事件
    handleMuted() {
      this.muted = !this.muted;
    },
    async handleDownload() {
      //  提示用户正在下载
      await uni.showLoading({
        title: "下载中...",
      });

      //  将远程文件 下载到微信小程序内存中
      const { tempFilePath } = (
        await uni.downloadFile({ url: this.videoObj.video })
      )[1];
      //  将内存中的文件 下载到本地内存中
      await uni.saveImageToPhotosAlbum({
        filePath: tempFilePath,
      });

      //  关闭loding提示用户下载完成
      uni.hideLoading()
      await uni.showToast({
          title: '下载成功'
      })
    },
  },
};
</script>

<style lang="scss" scoped>
.video_play {
  position: relative;
  image {
    position: absolute;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    //    css3滤镜
    filter: blur(8px);
  }

  .video_tool {
    height: 80rpx;
    display: flex;
    justify-content: flex-end;
    .iconfont {
      width: 80rpx;
      color: #fff;
      font-size: 50rpx;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(0, 0, 0, 0.2);
      margin-left: 20rpx;
    }

    .icon-zhuanfa {
      position: relative;
      button {
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        background-color: #fff;
      }
    }
  }

  .video_wrap {
    display: flex;
    justify-content: center;
    video {
      width: 360rpx;
      height: 600rpx;
    }
  }

  .download {
    display: flex;
    justify-content: center;
    margin-top: 30rpx;
    .download_btn {
      width: 360rpx;
      height: 80rpx;
      border-radius: 40rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      border: 3rpx solid #fff;
      background-color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>