<template>
  <scroll-view scroll-y enable-flex class="video_main" @scrolltolower="handleScrolltolower">
      <view class="video_item" v-for="item in videowp" :key="item.id" @click="handleGoVideo(item)">
          <image :src="item.img" mode="widthFix"></image>
      </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    urlobj: Object,
  },
  data(){
      return {
          videowp: [],
          hasMore: true
      }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.request({
        url: this.urlobj.url,
        data: this.urlobj.params,
      }).then((res) => {
        console.log(res);
        if(!res.res.videowp.length){
            this.hasMore = false
            uni.showToast({
                title: '没有更多数据了',
                icon: 'none'
            })
            return
        }
        this.videowp = [...this.videowp,...res.res.videowp]
      });
    },
    //  触底事件，加载下一页
    handleScrolltolower(){
        if(this.hasMore){
            this.urlobj.params.skip += this.urlobj.params.limit
            this.getList()
        }else{
            uni.showToast({
                title: '没有更多数据了',
                icon: 'none'
            })
        }
    },
    //  图片点击事件
    handleGoVideo(item){
        //  将数据存到全局中
        getApp().globalData.video = item
        //  页面跳转
        uni.navigateTo({
            url: '/pages/videoPlay/videoPlay'
        })
    }
  },
  watch: {
    urlobj() {
      console.log(this.urlobj);
      this.videowp = []
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.video_main{
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 36px);
    .video_item{
        width: 33.33%;
        border: 5rpx solid #fff;
    }
}
</style>