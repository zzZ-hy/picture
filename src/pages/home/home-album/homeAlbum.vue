<template>
  <scroll-view
    class="album_scroll_view"
    scroll-y
    @scrolltolower="handleToLower"
  >
    <!-- swiper
        自动轮播 autoplay
        指示器 indicator-dots
        衔接轮播 circular

        swiper 默认高度150px
        image 默认宽度320px => 基本样式中重置100%了
              默认宽度240px
        计算图片的宽高比例
        在写到swiper中
     -->
    <!-- swiper开始 -->
    <view class="banner_swiper">
      <swiper autoplay indicator-dots circular>
        <swiper-item v-for="item in banner" :key="item.id">
          <image :src="item.thumb"></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- swiper结束 -->

    <!-- 列表开始 -->
    <view class="album_list">
      <navigator
        :url="`/pages/album/album?id=${item.id}`"
        class="album_item"
        v-for="item in album"
        :key="item.id"
      >
        <view class="album_img">
          <image mode="aspectFill" :src="item.cover"></image>
        </view>
        <view class="album_info">
          <view class="album_name">{{ item.name }}</view>
          <view class="album_desc">{{ item.desc }}</view>
          <view class="album_btn">
            <view class="album_attention">+ 关注</view>
          </view>
        </view>
      </navigator>
    </view>
    <!-- 列表结束 -->
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      //  请求的参数
      params: {
        //  要获取几条数据
        limit: 30,
        //  关键字
        order: "new",
        //  要跳过的数据
        skip: 0,
      },
      banner: [],
      album: [],
      //  判断是否还有分页
      hasMore: true,
    };
  },
  mounted() {
    //  修改页面标题
    uni.setNavigationBarTitle({ title: "专辑" });
    this.getList();
  },
  methods: {
    getList() {
      this.request({
        url: "http://157.122.54.189:9088/image/v1/wallpaper/album",
        data: this.params,
      }).then((res) => {
        //  console.log(res);
        if (this.banner.length === 0) {
          this.banner = res.res.banner;
        }
        if (res.res.album.length === 0) {
          uni.showToast({
            title: "没有更多数据了",
            icon: "none",
          });
          this.hasMore = false;
          return;
        }
        this.album = [...this.album, ...res.res.album];
      });
    },
    handleToLower() {
      //  console.log('jiayou ');
      if (this.hasMore) {
        this.params.skip += this.params.limit;
        this.getList();
      } else {
        uni.showToast({
          title: "没有更多数据了",
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.album_scroll_view {
  height: calc(100vh - 36px);
}

.banner_swiper {
  swiper {
    //  height: calc(750rpx / 2.3);
    height: 326.1rpx;
    image {
      height: 100%;
    }
  }
}

.album_list {
  padding: 10rpx;
  .album_item {
    padding: 10rpx 0;
    display: flex;
    border: 1rpx solid #ccc;
    .album_img {
      flex: 1;
      padding: 10rpx;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }

    .album_info {
      flex: 2;
      padding: 0 10rpx;
      overflow: hidden;
      .album_name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx 0;
      }

      .album_desc {
        padding: 10rpx 0;
        font-size: 24rpx;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .album_btn {
        padding: 10rpx;
        display: flex;
        justify-content: flex-end;
        .album_attention {
          color: $color;
          border: 1rpx solid $color;
          padding: 10rpx;
        }
      }
    }
  }
}
</style>