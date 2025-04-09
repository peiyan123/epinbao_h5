<template>
  <div class="p-40px bg-white mb-36px rounded-8px">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <span class="font-size-56px font-semibold mr-50px w-250px van-ellipsis">{{
          data.companyName
        }}</span>
        <div>
          <div class="font-size-42px opacity-60 w-470px van-ellipsis mb-10px">职位：{{
          data.latestPosition
        }}</div>
         <div class="font-size-42px opacity-60 w-350px van-ellipsis">求职者：{{
          data.name
        }}</div>
        </div>
      </div>
      <!-- #979797 #000 -->
      <span
        class="font-size-48px font-semibold"
        :style="{ color: data.candidateStatus == 'YZZ' ? '#979797' : '#000' }"
        >{{ statusEnum[data.candidateStatus] }}</span
      >
    </div>
  </div>
</template>

<script setup>
  import { defineProps } from 'vue'
  // components
  import { Toast } from 'vant'

  const props = defineProps({
    data: { type: Object, default: () => {} },
  })
  const statusEnum = {
    DCS: '待初筛',
    SXTG: '筛选通过',
    SXTT: '筛选淘汰',
    DMS: '待面试',
    WMS: '未面试',
    MSTG: '面试通过',
    MSTT: '面试淘汰',
    YLY: '已录用',
    NLY: '拟录用',
    YF: '已发Offer',
    DRZ: '待入职',
    YRZ: '已入职',
    FQLY: '放弃录用',
    YZZ: '已终止',
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
