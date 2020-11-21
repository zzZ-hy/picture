<template>
  <scroll-view
    @scrolltolower="handleToLower"
    scroll-y
    class="recommend_view"
    v-if="recommendsList.length > 0"
  >
    <!-- 推荐开始 -->
    <view class="recommend_wrap">
      <navigator
        class="recommend_item"
        v-for="item in recommendsList"
        :key="item.id"
        :url="`/pages/album/album?id=5e26a5d3e7bce7393fd169fb`"
      >
        <image mode="widthFix" :src="item.thumb"></image>
      </navigator>
    </view>
    <!-- 推荐结束 -->

    <!-- 月份开始 -->
    <view class="monthes_wrap">
      <view class="monthes_title">
        <view class="monthes_title_info">
          <view class="monthes_info">
            <text> {{ monthes.DD }} / </text>
            {{ monthes.MM }} 月
          </view>
          <view class="monthes_text">{{ monthes.title }}</view>
        </view>
        <view class="monthes_title_more">更多 > </view>
      </view>
      <view class="monthes_content">
        <view class="monthes_item" v-for="(item,index) in monthes.items" :key="item.id">
          <go-detail :list="monthes.items" :index="index">
            <image
              mode="aspectFill"
              :src="item.thumb + item.rule.replace('$<Height>', 360)"
            ></image>
          </go-detail>
        </view>
      </view>
    </view>
    <!-- 月份结束 -->

    <!-- 热门开始 -->
    <view class="hots_wrap">
      <view class="hots_title">
        <text>热门</text>
      </view>
      <view class="hots_content">
        <view class="hot_item" v-for="(item,index) in hots" :key="item.id">
          <go-detail :list="hots" :index="index">
            <image :src="item.thumb" mode="widthFix"></image>
          </go-detail>
        </view>
      </view>
    </view>
    <!-- 热门结束 -->
  </scroll-view>
</template>

<script>
import moment from "moment";
import goDetail from "../../../components/goDetail";

export default {
  components: {
    goDetail,
  },
  data() {
    return {
      recommendsList: [],
      monthes: {},
      //  热门
      hots: [],
      //  请求的参数
      params: {
        //  要获取几条数据
        limit: 30,
        //  关键字
        order: "hot",
        //  要跳过的数据
        skip: 0,
      },
      //  是否还有下一页
      hasMore: true,
    };
  },
  methods: {
    //  获取接口的数据
    getList() {
      this.request({
        url: "http://157.122.54.189:9088/image/v3/homepage/vertical",
        data: this.params,
      }).then((res) => {
        //  console.log(res);

        //  判断下一页还有没有数据
        if (res.res.vertical.length === 0) {
          uni.showToast({
            title: "没有更多数据了",
            icon: "none",
          });
          this.hasMore = false;
          return;
        }

        if (this.recommendsList.length === 0) {
          //  推荐数据
          this.recommendsList = res.res.homepage[1].items;
          //  月份数据
          this.monthes = res.res.homepage[2];
          //  将时间戳 改成 18号/11月 插件 moment.js
          this.monthes.MM = moment(this.monthes.stime).format("MM");
          this.monthes.DD = moment(this.monthes.stime).format("DD");
        }

        //  热门数据
        //  数组拼接  ...
        this.hots = [...this.hots, ...res.res.vertical];
      });
    },
    //  滚动条触底事件
    handleToLower() {
      /**
       * 1.修改参数 skip
       * 2.重新发送请求
       * 3.请求成功，数据叠加
       */
      if (this.hasMore) {
        this.params.skip += this.params.limit;
        this.getList();
      } else {
        uni.showToast({
          title: "没有数据了!",
          icon: "none",
        });
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.recommend_view {
  //  height: 屏幕的高 - 头部标题的高
  height: calc(100vh - 36px);
}

.recommend_wrap {
  display: flex;
  flex-wrap: wrap;
  .recommend_item {
    width: 50%;
    border: 5rpx solid #fff;
  }
}

.monthes_wrap {
  .monthes_title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    .monthes_title_info {
      color: $color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .monthes_info {
        text {
          font-size: 36rpx;
        }
      }

      .monthes_text {
        font-size: 34rpx;
        color: #666;
        margin-left: 30rpx;
      }
    }

    .monthes_title_more {
      font-size: 24rpx;
      color: $color;
    }
  }

  .monthes_content {
    display: flex;
    flex-wrap: wrap;
    .monthes_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}

.hots_wrap {
  .hots_title {
    padding: 20rpx;
    text {
      border-left: 15rpx solid $color;
      padding-left: 15rpx;
      font-size: 34rpx;
      font-weight: 600;
    }
  }

  .hots_content {
    display: flex;
    flex-wrap: wrap;
    .hot_item {
      width: 33.33%;
      border: 5rpx solid #fff;
      image {
      }
    }
  }
}
</style>