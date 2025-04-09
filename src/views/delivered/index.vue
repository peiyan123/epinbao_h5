<template>
  <div class="my-header h-506px fixed top-0 left-0 right-0"></div>
  <div class="bg-custom-gray min-h-100vh">
    <!-- <Sticky :offset-top="0"> -->
    <div class="px-60px flex h-250px relative">
      <!-- <span class="font-size-56px">人才库</span>
      <div></div> -->
      <!-- <div
        class="i-epinbao-left-arrow w-57px cursor-pointer absolute top-100px left-60px"
        @click="handleBack"
      ></div> -->
      <div class="flex items-center">
        <div class="font-size-46px py-36px text-#444 mr-80px" @click="handleGoHome" v-if="isLogin"
          >职位广场</div
        >
        <div class="mr-80px font-size-46px" @click="handleGoTalent">人才库</div>
        <div class="font-size-72px">已投递</div>
      </div>
    </div>
    <!-- </Sticky> -->
    <Empty class="mt-100px" description="暂无数据" v-if="talentList.length === 0" />
    <List
      v-else
      class="px-36px overflow-auto calc-h relative"
      @load="handleLoad"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      offset="1"
    >
      <ListItem v-for="(item, index) in talentList" :key="index" :data="item"></ListItem>
    </List>
  </div>
  <Overlay :show="showOverlay">
    <div class="h-full flex justify-center items-center">
      <Loading type="spinner" color="#1989fa" vertical> 加载中... </Loading>
    </div>
  </Overlay>
</template>

<script setup>
  import { onMounted, reactive, ref, computed } from 'vue'
  // compontents
  import { Sticky, Overlay, Loading, List, Empty, Toast } from 'vant'
  import ListItem from './components/ListItem.vue'
  // hooks
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  // api
  import { deliveredList } from '@/api/api'

  const store = useStore()
  const router = useRouter()
  const showOverlay = ref(false)
  const finished = ref(false)
  const loading = ref(false)
  const talentList = ref([])
  const searchData = reactive({
    pageNo: 1,
    pageSize: 10,
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
      deliveredList(searchData)
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
    deliveredList(searchData)
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
  function handleGoTalent() {
    router.push({ path: '/talent' })
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
