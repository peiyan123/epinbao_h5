<template>
  <SwipeCell class="my-swipe-cell" :before-close="beforeClose">
    <div class="px-60px bg-white py-80px mb-36px" @click="handleDetail">
      <div class="flex items-center justify-between">
        <span class="font-size-56px font-semibold van-ellipsis w-500px">{{ data.jobName }}</span>
        <span class="text-primary font-size-42px">{{ data.wageRange }}</span>
      </div>
      <div class="flex items-center flex-wrap mt-32px">
        <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray"
          >{{ data.companyName }}</div
        >
        <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray">{{
          data.workAddress
        }}</div>
        <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray">{{
          data.educationLevelReq
        }}</div>
        <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray"
          >{{ data.workExpReq }}年</div
        >
      </div>
      <!-- <div class="van-multi-ellipsis--l2 mt-42px text-custom-gray"
      >负责抖音生活服务用户端UI/UX设计工作，包括但不限于同城、视频feed、直播间、流量场景等</div
    > -->
    </div>
    <template #right>
      <Button square type="primary" text="投递" />
    </template>
  </SwipeCell>
</template>

<script setup>
  import { defineProps } from 'vue'
  import { useRouter } from 'vue-router'
  // components
  import { SwipeCell, Button } from 'vant'
  const props = defineProps({
    data: { type: Object, default: () => {} },
  })

  const router = useRouter()

  function handleDetail() {
    router.push({
      path: '/detail',
      query: {
        id: props.data.id,
      },
    })
  }
  async function beforeClose({ position }) {
    if (position === 'right') {
      router.push({
        path: '/talent',
        query: { jobId: props.data.id, company: props.data.companyName },
      })
    }
  }
</script>
<style scoped lang="less">
  .my-swipe-cell {
    :deep(.van-swipe-cell__right) {
      button {
        height: 100%;
      }
    }
  }
</style>
