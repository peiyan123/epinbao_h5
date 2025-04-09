<template>
  <div class="my-home bg-custom-gray min-h-100vh">
    <Sticky :offset-top="0">
      <div class="px-60px font-semibold my-header h-506px">
        <div class="flex items-center h-250px">
          <div class="font-size-72px py-36px">职位广场</div>
          <div class="font-size-46px ml-80px text-#444" @click="handleGoTalent">人才库</div>
          <div class="font-size-46px ml-80px text-#444" @click="handleGoDelivered">已投递</div>
        </div>
        <Search
          class="rounded-63px h-104px bg-white my-search font-size-38px overflow-hidden"
          v-model="searchData.jobName"
          @search="handleSearch"
          @click-left-icon="handleSearch"
          placeholder="搜索"
        >
          <template #left-icon>
            <div class="i-epinbao-search w-43px h-51px mr-30px"> </div>
          </template>
        </Search>
        <DropdownMenu active-color="#3BA8FF" class="filter">
          <!-- 学历 -->
          <DropdownItem
            v-model="searchData.education"
            :options="educationLevelList"
            @change="changeFilter"
          />
          <!-- 工作地点 -->
          <!-- <DropdownItem
            v-model="searchData.workAddress"
            :options="workAddressList"
            @change="changeFilter"
          /> -->
          <!-- 工作性质 -->
          <DropdownItem
            v-model="searchData.workNature"
            :options="workNatureList"
            @change="changeFilter"
          />

          <Button
            plain
            class="font-size-42px rounded-36px bg-white h-64px border-none"
            @click="handleReset"
          >
            重置
          </Button>
        </DropdownMenu>
      </div>
    </Sticky>
    <Empty description="暂无数据" v-if="jobList.length === 0" />
    <List
      v-else
      class="mt-24px"
      @load="handleLoad"
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      offset="1"
    >
      <ListItem v-for="(item, index) in jobList" :key="index" :data="item" />
    </List>
    <Overlay :show="showOverlay">
      <div class="h-full flex justify-center items-center">
        <Loading type="spinner" color="#1989fa" vertical> 加载中... </Loading>
      </div>
    </Overlay>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  // components
  import {
    Sticky,
    Search,
    List,
    Toast,
    DropdownMenu,
    DropdownItem,
    Button,
    Empty,
    Overlay,
    Loading,
  } from 'vant'
  import ListItem from './components/ListItem'
  // api
  import { queryWxJobList } from '@/api/api'
  import router from '@/router'

  const jobList = ref([])
  const educationLevelList = [
    { text: '学历', value: '' },
    { text: '大专', value: '大专' },
    { text: '本科', value: '本科' },
    { text: '硕士', value: '硕士' },
    { text: '博士', value: '博士' },
  ]
  // const workAddressList = [
  //   { text: '工作地点', value: '' },
  //   { text: '上海', value: '上海' },
  //   { text: '北京', value: '北京' },
  //   { text: '成都', value: '成都' },
  //   { text: '重庆', value: '重庆' },
  //   { text: '沈阳', value: '沈阳' },
  //   { text: '南京', value: '南京' },
  //   { text: '广州', value: '广州' },
  //   { text: '长春', value: '长春' },
  //   { text: '武汉', value: '武汉' },
  //   { text: '深圳', value: '深圳' },
  //   { text: '大连', value: '大连' },
  //   { text: '苏州', value: '苏州' },
  //   { text: '底特律', value: '底特律' },
  //   { text: '扬州', value: '扬州' },
  //   { text: '天津', value: '天津' },
  //   { text: '柏林', value: '柏林' },
  //   { text: '保定', value: '保定' },
  //   { text: '合肥', value: '合肥' },
  //   { text: '宁波', value: '宁波' },
  //   { text: '惠州', value: '惠州' },
  // ]
  const workNatureList = [
    { text: '工作性质', value: '' },
    { text: '兼职人员', value: '兼职人员' },
    { text: '劳务人员', value: '劳务人员' },
    { text: '外协人员', value: '外协人员' },
    { text: '实习生', value: '实习生' },
    { text: '正式员工', value: '正式员工' },
  ]
  const showOverlay = ref(false)
  const loading = ref(false)
  const finished = ref(false)
  const searchData = reactive({
    pageNo: 1,
    pageSize: 10,
    jobName: '',
    education: '',
    workNature: '',
  })

  function getList() {
    jobList.value = []
    queryWxJobList(searchData)
      .then((res) => {
        if (res.success) {
          jobList.value = res.result.records
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
  function handleSearch() {
    showOverlay.value = true
    searchData.pageNo = 1
    finished.value = false
    getList()
  }
  function handleReset() {
    showOverlay.value = true
    searchData.education = ''
    searchData.workNature = ''
    searchData.jobName = ''
    searchData.pageNo = 1
    finished.value = false
    getList()
  }
  const changeFilter = () => {
    showOverlay.value = true
    searchData.pageNo = 1
    finished.value = false
    getList()
  }
  function handleLoad() {
    if (jobList.value.length >= 10) {
      showOverlay.value = true
      searchData.pageNo++
      queryWxJobList(searchData)
        .then((res) => {
          if (res.code === 200) {
            if (res.result.records.length === 0) {
              finished.value = true
            } else {
              jobList.value = [...jobList.value, ...res.result.records]
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
  function handleGoTalent() {
    router.push('/talent')
  }
  function handleGoDelivered() {
    router.push('/delivered')
  }
  onMounted(() => {
    showOverlay.value = true
    getList()
  })
</script>
<style scoped lang="less">
  .my-header {
    background: linear-gradient(180deg, #3ba8ff 0%, #ffffff 100%);
  }
  .filter {
    margin-top: 30px;
    display: flex;
    align-items: center;
    padding-right: 12px;
    background-color: transparent;
    :deep(.van-dropdown-menu__bar) {
      flex: 1;
      background: transparent;
      box-shadow: none;
      .van-dropdown-menu__title:after {
        border-color: transparent transparent #000 #000;
      }
    }
    :deep(.van-dropdown-menu__bar--opened) {
      .van-dropdown-menu__title:after {
        border-color: transparent transparent var(--van-blue) var(--van-blue);
      }
    }
    :deep(.van-dropdown-menu__item) {
      flex: none;
      margin-right: 200px;
    }
    :deep(.van-popup) {
      border-bottom-left-radius: 50px;
      border-bottom-right-radius: 50px;
    }
  }
</style>
<style lang="less">
  .my-home {
    .van-search__content {
      background: #fff;
    }
  }
</style>
