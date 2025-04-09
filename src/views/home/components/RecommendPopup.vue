<template>
  <Popup v-bind="$attrs" position="bottom" round closeable>
    <div class="text-center font-size-48px mt-35px">立即推荐</div>
    <div class="mt-110px flex justify-center">
      <img class="w-600px h-600px" :src="imgUrl" alt="" />
    </div>
    <div class="flex justify-center mt-46px">
      <div class="flex items-center">
        <van-icon size="31px" name="checked" /><span class="font-size-48px ml-36px"
          >已生成二维码</span
        ></div
      >
    </div>
    <div class="flex items-center justify-around px-100px my-150px">
      <div class="flex flex-col items-center" @click="handleSave">
        <div class="w-168px h-168px i-epinbao-download"></div>
        <span class="mt-46px font-size-42px">保存图片</span>
      </div>
      <div class="flex flex-col items-center" @click="handleCopy">
        <div class="w-168px h-168px i-epinbao-copy"></div>
        <span class="mt-46px font-size-42px">复制链接</span>
      </div>
    </div>
  </Popup>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useStore } from 'vuex'
  // components
  import QRCode from 'qrcode'
  import { Popup, Toast } from 'vant'
  // hooks
  import { copyTextToClipboard } from '@/hooks/useCopy'
  import { downloadByUrl } from '@/utils/files/download'

  const imgUrl = ref('')
  const store = useStore()
  const currentPageUrl =
    location.href + '&recommendCode=' + store.state.user?.userInfo?.userInfo?.recommendCode
  function handleCopy() {
    copyTextToClipboard(currentPageUrl)
    Toast('已复制链接，快去分享吧')
  }
  function handleSave() {
    downloadByUrl({ url: imgUrl.value, fileName: '分享二维码.png' })
    Toast('已保存图片，快去分享吧')
  }
  function getQrcode() {
    QRCode.toDataURL(currentPageUrl).then((url) => {
      imgUrl.value = url
    })
  }
  onMounted(() => {
    getQrcode()
  })
</script>
<style scoped lang="less"></style>
