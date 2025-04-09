<template>
  <router-view />
</template>

<script>
  // import VConsole from 'vconsole'
  // import { getWxSign } from '@/api/api'

  export default {
    name: 'App',
    components: {},
    setup() {
      return {}
    },
    mounted() {
      // const vc = new VConsole()
      // console.log(vc)
      // getWxSign({
      //   url: window.location.href,
      // }).then((res) => {
      //   const { result } = res
      //   console.log('info:', res.result)
      //   // eslint-disable-next-line no-undef
      //   wx.config({
      //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      //     appId: result.appId, // 必填，公众号的唯一标识
      //     timestamp: result.timestamp, // 必填，生成签名的时间戳
      //     nonceStr: result.nonceStr, // 必填，生成签名的随机串
      //     signature: result.signature, // 必填，签名
      //     jsApiList: ['updateTimelineShareData', 'updateAppMessageShareData'], // 必填，需要使用的JS接口列表
      //   })
      // })
    },
  }
</script>

<style lang="less"></style>
