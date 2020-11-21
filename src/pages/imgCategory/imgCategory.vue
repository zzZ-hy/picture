<template>
  <view class="category_tab">
    <view class="category_tab_title">
      <view class="title_inner">
        <uni-segmented-control
          :current="current"
          :values="items.map((v) => v.title)"
          @clickItem="onClickItem"
          style-type="text"
          active-color="#d4237a"
        ></uni-segmented-control>
      </view>
      <text class="iconfont icon-sousuo"></text>
    </view>
    <scroll-view
      enable-flex
      scroll-y
      class="category_tab_content"
      @scrolltolower="handleScrolltolower"
    >
      <view class="cate_item" v-for="item in vertical" :key="item.id">
        <image :src="item.thumb" mode="aspectFill"></image>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { title: "最新", order: "new" },
        { title: "热门", order: "hot" },
      ],
      current: 0,
      params: {
        limit: 30,
        skip: 0,
        order: "new",
      },
      id: 0,
      //    图片分类数据
      vertical: [],
      hasMore: true,
    };
  },
  onLoad(options) {
    //  console.log(options);
    this.id = options.id;
    this.getList();
  },
  methods: {
    onClickItem(e) {
      //  根据被点击的标题 切换标题

      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;

        //  切换order
        //  重新发送请求
        this.params.order = this.items[e.currentIndex].order;
        this.params.skip = 0;
        this.vertical = [];

        this.getList();
      }
    },
    getList() {
      this.request({
        url: `http://157.122.54.189:9088/image/v1/vertical/category/${this.id}/vertical`,
        data: this.params,
      }).then((res) => {
        //  console.log(res);
        if (res.res.vertical.length) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多数据了",
            icon: "none",
          });
          return;
        }
        this.vertical = [...this.vertical, ...res.res.vertical];
      });
    },
    //  触底触发，加载下一页数据
    handleScrolltolower() {
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
.category_tab {
  .category_tab_title {
    position: relative;
    .title_inner {
      width: 35%;
      margin: 0 auto;
    }
    .icon-sousuo {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5%;
    }
  }
  .category_tab_content {
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 36px);
    .cate_item {
      width: 33.33%;
      border: 5rpx solid #fff;
      image {
      }
    }
  }
}
</style>