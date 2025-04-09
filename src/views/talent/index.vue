<template>
  <div class="my-header h-506px fixed top-0 left-0 right-0"></div>
  <div class="bg-custom-gray min-h-100vh">
    <!-- <Sticky :offset-top="0"> -->
    <div class="px-60px flex items-center h-250px relative">
      <!-- <span class="font-size-56px">人才库</span>
      <div></div> -->
      <!-- <div class="i-epinbao-left-arrow w-57px cursor-pointer mr-20px" @click="handleBack"></div> -->
      <div class="flex items-center mr-140px" @click="handleBack" v-if="jobId">
        <van-icon name="arrow-left" class="mr-20px" />
        <div class="text-#444 font-size-46px">返回</div>
      </div>
      <div class="flex items-center">
        <div
          class="font-size-46px py-36px text-#444 mr-80px"
          @click="handleGoHome"
          v-if="isLogin && !jobId"
          >职位广场</div
        >
        <div class="mr-80px font-size-72px">人才库</div>
        <div class="font-size-46px" @click="handleGoDelivered" v-if="!jobId">已投递</div>
      </div>
      <div
        v-if="isLogin && !jobId"
        class="w-64px font-size-24px bg-#D9D9D9 text-center absolute right-42px cursor-pointer"
        @click="handleUpload"
      >
        上传简历
      </div>
    </div>
    <!-- </Sticky> -->
    <Empty description="暂无数据" v-if="talentList.length === 0" />
    <List
      v-else
      class="px-36px overflow-auto calc-h"
      @load="handleLoad"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      offset="1"
    >
      <ListItem
        v-for="(item, index) in talentList"
        :key="index"
        :data="item"
        :company="company"
        :job-id="jobId"
      ></ListItem>
    </List>
  </div>
  <Overlay :show="showOverlay">
    <div class="h-full flex justify-center items-center">
      <Loading type="spinner" color="#1989fa" vertical> 加载中... </Loading>
    </div>
  </Overlay>
  <Uploader
    accept=".docx,.pdf"
    :max-count="1"
    :after-read="afterRead"
    class="hidden"
    ref="uploadRef"
  >
  </Uploader>
  <UploadProgressPopup
    :page="'talent'"
    :upload-status="uploadStatus"
    :upload-progress="uploadProgress"
    @success="getList"
  />
</template>

<script setup>
  import { onMounted, reactive, ref, computed } from 'vue'
  // compontents
  import { Sticky, Overlay, Loading, List, Empty, Toast, Uploader } from 'vant'
  import ListItem from './components/ListItem.vue'
  import UploadProgressPopup from '@/views/home/components/UploadProgressPopup.vue'
  // hooks
  import { useRouter, useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { useUpload } from '@/views/home/hooks/useUpload'
  // api
  import { hrTalentList } from '@/api/api'

  const uploadRef = ref(null)
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const jobId = route.query.jobId
  const company = route.query.company
  const showOverlay = ref(false)
  const finished = ref(false)
  const loading = ref(false)
  const talentList = ref([])
  const searchData = reactive({
    pageNo: 1,
    pageSize: 10,
  })
  const recommendCode = computed(() => store.state.user?.userInfo?.userInfo?.recommendCode)
  const { fileList, afterRead, uploadStatus, uploadProgress } = useUpload({
    recommendCode: recommendCode.value,
  })

  const isLogin = computed(() => {
    return store.getters['user/isLogin']
  })
  function handleBack() {
    router.back()
  }
  function handleLoad() {
    if (talentList.value.length >= 10) {
      showOverlay.value = true
      searchData.pageNo++
      hrTalentList(searchData)
        .then((res) => {
          if (res.code === 200) {
            if (res.result.records.length === 0) {
              finished.value = true
            } else {
              talentList.value = [...talentList.value, ...res.result.records]
            }
          } else {
            Toast(res.message)
          }
        })
        .finally(() => {
          showOverlay.value = false
          loading.value = false
        })
    } else {
      loading.value = false
    }
  }
  function getList() {
    talentList.value = []
    searchData.pageNo = 1
    showOverlay.value = true
    hrTalentList(searchData)
      .then((res) => {
        if (res.success) {
          talentList.value = res.result.records
        } else {
          Toast(res.message)
        }
      })
      .catch()
      .finally(() => {
        showOverlay.value = false
        loading.value = false
      })
  }
  function handleGoHome() {
    router.push({ path: '/home' })
  }

  function handleGoDelivered() {
    router.push({ path: '/delivered' })
  }

  function handleUpload() {
    uploadRef.value.chooseFile()
  }
  onMounted(() => {
    getList()
  })
</script>
<style scoped lang="less">
  .my-header {
    background: linear-gradient(180deg, #3ba8ff 0%, #f1f2f6 100%);
  }
  .calc-h {
    height: calc(100vh - 250px);
  }
</style>
