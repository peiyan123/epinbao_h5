<template>
  <Popup position="bottom" round v-model:show="show" :close-on-click-overlay="false">
    <div class="px-60px py-75px">
      <div v-if="uploadStatus === 1">
        <div class="w-full bg-custom-gray h-48px rounded-12px overflow-hidden mt-100px">
          <div class="h-full bg-primary" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <div class="font-size-36px mt-10px">{{ uploadProgress + '%' }}</div>
        <div class="font-size-48px mt-10px text-center">{{
          page == 'talent' ? '简历上传中...' : '简历解析中...'
        }}</div>
      </div>
      <div class="flex justify-center mt-180px" v-if="uploadStatus === 2 || uploadStatus === 3">
        <div class="flex items-center">
          <van-icon size="31px" :name="uploadStatus === 2 ? 'checked' : 'clear'" />
          <span class="font-size-48px ml-36px" v-if="page == 'talent'">{{
            uploadStatus === 2 ? '简历上传成功' : '简历上传失败'
          }}</span>
          <span class="font-size-48px ml-36px" v-else>{{
            uploadStatus === 2 ? '简历解析成功' : '简历解析失败'
          }}</span>
        </div>
      </div>
      <div>
        <Button
          class="mt-96px h-140px font-size-45px"
          size="small"
          type="primary"
          round
          block
          :disabled="uploadStatus === 1"
          @click="handleClose"
          >关闭</Button
        >
      </div>
    </div>
  </Popup>
</template>

<script setup>
  import { defineProps, ref, watch, defineEmits } from 'vue'
  // components
  import { Popup, Button } from 'vant'
  // hooks
  import { useRouter, useRoute } from 'vue-router'
  // api
  import AxiosCanceler from '@/utils/axiosCancel'

  const props = defineProps({
    uploadProgress: { type: Number, default: 0 },
    uploadStatus: { type: Number, default: 0 },
    recommendCode: { type: String, default: '' },
    page: { type: String, default: '' },
  })
  const emits = defineEmits(['success'])
  const route = useRoute()
  const show = ref(false)
  const router = useRouter()
  watch(
    () => props.uploadStatus,
    (v) => {
      if (v === 1) {
        show.value = true
      }
    },
    {
      immediate: true,
    },
  )
  function handleClose() {
    if (props.uploadStatus === 2) {
      if (props.page === 'talent') {
        emits('success')
        show.value = false
      } else {
        router.push({
          path: '/resume',
          query: {
            id: route.query.id,
          },
        })
      }
    } else {
      show.value = false
      const axiosCanceler = new AxiosCanceler()
      axiosCanceler.removeAllPending()
    }
  }
</script>
<style scoped lang="less"></style>
