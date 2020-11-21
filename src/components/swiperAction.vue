<template>
  <view @touchstart="handleTouchstart" @touchend="handleTouchend">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {
      //  按下的时间
      startTime: 0,
      //  按下的坐标
      startX: 0,
      startX: 0,
    };
  },
  methods: {
    //  按下事件
    handleTouchstart(e) {
      //  生成时间
      this.startTime = Date.now();
      //  获取按下的坐标
      this.startX = e.changedTouches[0].clientX;
      this.startY = e.changedTouches[0].clientY;
    },
    //  离开事件
    handleTouchend(e) {
      //  生成时间
      const endTime = Date.now();

      //  获取坐标
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      //  判断滑动时间是否合法
      if (endTime - this.startTime > 2000) return;

      //  滑动的方向
      let direction = ''
      //  判断滑动坐标是否合法
      if (Math.abs(endX - this.startX) > 20 && Math.abs(endY - this.startY) < 30) {
          direction = endX - this.startX > 0 ? 'right' : 'left'
      }else{
          return
      }

      //    全部合法之后
      this.$emit('swiperAction',{direction})
    }
  }
};
</script>

<style>
</style>