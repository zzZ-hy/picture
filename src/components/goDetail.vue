<template>
  <view @click="handleCilck">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    list: Array,
    index: Number,
  },
  methods: {
      handleCilck(){
          //    将数据缓存下来
          getApp().globalData.imgList = this.list
          getApp().globalData.imgIndex = this.index
          //    在实现跳转页面
          uni.navigateTo({
              url: '/pages/imgDetail/imgDetail'
          })
      }
  },
};
</script>

<style>
</style>