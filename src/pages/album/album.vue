<template>
  <view class="l">
    <!-- 专辑背景开始 -->
    <view class="album_bg">
      <image mode="widthFix" :src="album.cover"></image>
      <view class="album_info">
        <view class="album_name">{{ album.name }}</view>
        <view class="album_btn">关注专辑</view>
      </view>
    </view>
    <!-- 专辑背景结束 -->

    <!-- 专辑作者开始 -->
    <view class="album_author">
      <view class="album_author_info">
        <image mode="widthFix" :src="album.user.avatar"></image>
        <view class="author_name">{{ album.user.name }}</view>
      </view>
      <view class="album_author_desc">
        <text>{{ album.desc }}</text>
      </view>
    </view>
    <!-- 专辑作者结束 -->

    <!-- 图片列表开始 -->
    <view class="album_list">
      <view
        class="album_item"
        v-for="(item, index) in wallpaper"
        :key="item.id"
      >
        <go-detail :list="wallpaper" :index="index">
          <image
            mode="aspectFill"
            :src="item.thumb + item.rule.replace('$<Height>', 360)"
          ></image>
        </go-detail>
      </view>
    </view>
    <!-- 图片列表结束 -->
  </view>
</template>

<script>
import goDetail from "../../components/goDetail.vue";
export default {
  components: { 
    goDetail
  },
  data() {
    return {
      params: {
        //  要获取几条数据
        limit: 30,
        //  关键字
        order: "new",
        //  要跳过的数据
        skip: 0,
        //  1 返回值中有album这个值
        //  0 返回值中有没有album这个值
        first: 1,
      },
      id: -1,
      album: {},
      wallpaper: [],
      //   是否还有下一页数据
      hasMore: true,
    };
  },
  onLoad(options) {
    this.id = options.id;

    this.getList();
  },
  //    页面触底 上拉加载更多事件
  onReachBottom() {
    console.log("dixian");
    if (this.hasMore) {
      this.params.first = 0;
      this.params.skip += this.params.limit;
      this.getList();
    } else {
      uni.showToast({
        title: "没有更多数据了",
        icon: "none",
      });
    }
  },
  methods: {
    getList() {
      this.request({
        url: `http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.params,
      }).then((res) => {
        //  console.log(res);
        if (Object.keys(this.album).length === 0) this.album = res.res.album;

        if (res.res.wallpaper.length === 0) {
          uni.showToast({
            title: "没有更多数据了",
            icon: "none",
          });
          this.hasMore = false;
          return;
        }

        this.wallpaper = [...this.wallpaper, ...res.res.wallpaper];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.album_bg {
  position: relative;
  image {
  }

  .album_info {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    height: 80rpx;
    align-items: center;
    color: #fff;
    padding: 0 15rpx;
    .album_name {
      font-size: 40rpx;
    }

    .album_btn {
      background-color: $color;
      width: 152rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
    }
  }
}

.album_author {
  padding: 10rpx;
  .album_author_info {
    padding: 10rpx 0;
    display: flex;
    image {
      width: 50rpx;
    }

    .author_name {
      color: #000;
      margin-left: 15rpx;
    }
  }

  .album_author_desc {
  }
}

.album_list {
  display: flex;
  flex-wrap: wrap;
  .album_item {
    width: 33.33%;
    border: 3rpx solid #fff;
    image {
      height: 160rpx;
    }
  }
}
</style>