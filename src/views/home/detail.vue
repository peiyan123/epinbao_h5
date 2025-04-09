<template>
  <div class="px-60px min-h-100vh">
    <Sticky :offset-top="0" v-show="isLogin">
      <div class="h-38px py-60px bg-white">
        <div class="i-epinbao-left-arrow w-57px cursor-pointer" @click="handleBack"></div>
      </div>
    </Sticky>
    <div class="flex items-center justify-between py-20px">
      <span class="font-size-88px font-semibold">{{ detail.jobName }}</span>
      <span class="text-primary font-size-42px">{{ detail.wageRange }}</span>
    </div>
    <div class="flex item-center flex-wrap py-74px">
      <div class="flex items-center">
        <div class="i-epinbao-address w-48px h-48px"></div>
        <div class="text-custom-gray font-size-42px ml-24px">{{ detail.workAddress }}</div>
      </div>
      <div class="flex items-center ml-35px">
        <div class="i-epinbao-education w-48px h-48px"></div>
        <div class="text-custom-gray font-size-42px ml-24px">{{ detail.educationLevelReq }}</div>
      </div>
      <div class="flex items-center ml-35px">
        <div class="i-epinbao-year w-48px h-48px"></div>
        <div class="text-custom-gray font-size-42px ml-24px">{{ detail.workExpReq }}年</div>
      </div>
    </div>
    <Divider dashed class="m-0" />
    <div class="flex items-center justify-between pr-20px py-85px">
      <div>
        <div class="font-size-48px font-bold">工作地址</div>
        <div class="mt-32px font-size-42px text-custom-gray"> {{ detail.workAddress }} </div>
      </div>
      <div class="i-epinbao-right-icon w-25px h-26px"></div>
    </div>
    <Divider dashed class="m-0" />
    <div class="mt-74px">
      <div class="font-size-48px font-bold">职位详情</div>
      <div class="font-size-36px text-custom-gray mt-54px">职位要求</div>
    </div>
    <div class="pb-290px"><MarkDownViewer :value="detail.jobDescription" /></div>
    <div class="h-290px flex items-center fixed bottom-0 bg-white">
      <div class="flex items-center">
        <div class="flex items-center flex-col mr-50px" @click="handleRecommend" v-if="!isShare">
          <div class="i-epinbao-recommend w-60px h-48px"></div>
          <div class="font-size-36px mt-20px">立即推荐</div>
        </div>
        <Uploader
          accept=".docx,.pdf"
          :max-count="1"
          :after-read="afterRead"
          class="hidden"
          ref="uploadRef"
        >
          <!-- <Button
            class="h-140px rounded-70px font-size-45px"
            :class="isLogin ? 'w-760px' : 'w-950px'"
            type="primary"
            >立即投递</Button
          > -->
        </Uploader>
        <Button
          class="h-140px rounded-70px font-size-45px"
          :class="isShare ? 'w-950px' : 'w-760px'"
          type="primary"
          @click="handleDeliver"
          >立即投递</Button
        >
      </div>
    </div>
  </div>
  <RecommendPopup v-model:show="show" />
  <UploadProgressPopup :upload-status="uploadStatus" :upload-progress="uploadProgress" />
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useStore } from 'vuex'
  // components
  import { Button, Divider, Sticky, Uploader, Toast } from 'vant'
  import RecommendPopup from '@/views/home/components/RecommendPopup.vue'
  import UploadProgressPopup from '@/views/home/components/UploadProgressPopup.vue'
  import MarkDownViewer from '@/component/MarkDownViewer.vue'
  // hooks
  import { useRouter, useRoute } from 'vue-router'
  import { useUpload } from './hooks/useUpload'
  // api
  import { queryWxJobDetailById, queryJobDetailById, hrTalentList, getWxSign } from '@/api/api'

  // const des =
  //   '<h1>富文本示例</h1><h1>富文本示例</h1><h1>富文本示例</h1><h1>富文本示例</h1><h1>富文本示例</h1><h1>富文本示例</h1><h1>富文本示例1111</h1>'
  const uploadRef = ref(null)
  const show = ref(false)
  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const detail = ref({})
  const talentList = ref()
  const isLogin = computed(() => {
    return store.getters['user/isLogin']
  })

  const recommendCode = computed(() => store.state.user?.userInfo?.userInfo?.recommendCode)
  if (route.query.recommendCode) {
    store.commit('user/setRecommendCode', route.query.recommendCode)
  }
  const isShare = computed(() => {
    return store.getters['user/isShare']
  })
  const { fileList, afterRead, uploadStatus, uploadProgress } = useUpload({
    recommendCode: route.query.recommendCode || recommendCode.value,
  })

  function handleRecommend() {
    show.value = true
  }
  function handleBack() {
    router.push('/home')
  }
  function getDetails() {
    const id = route.query.id
    queryWxJobDetailById({ id }).then((res) => {
      if (res.success) {
        document.title = `${res?.result?.jobName}${'【欢迎投递】'}`
        detail.value = res.result

        console.log(res.result)
        // eslint-disable-next-line no-undef
        wx.ready(function () {
          // eslint-disable-next-line no-undef
          wx.updateAppMessageShareData({
            title: res?.result?.jobName, // 分享标题
            desc: `${res?.result?.workAddress} - ${res?.result?.departmentName} 岗位类型：${res?.result?.jobCategoryName}`, // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://h5.epinbao.com/favicon.ico', // 分享图标
            success: function () {
              // 设置成功
            },
          })
        })
      } else {
        Toast(res.message)
      }
    })
  }
  function getDetailsByShare() {
    const id = route.query.id
    queryJobDetailById({ id, inviteCode: store.state.user.recommendCode }).then((res) => {
      if (res.success) {
        document.title = `${res?.result?.jobName}${'【欢迎投递】'}`
        detail.value = res.result

        // eslint-disable-next-line no-undef
        wx.ready(function () {
          // eslint-disable-next-line no-undef
          wx.updateAppMessageShareData({
            title: res?.result?.jobName, // 分享标题
            desc: `${res?.result?.workAddress} - ${res?.result?.departmentName} 岗位类型：${res?.result?.jobCategoryName}`, // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: 'https://h5.epinbao.com/favicon.ico', // 分享图标
            success: function () {
              // 设置成功
            },
          })
        })
      } else {
        Toast(res.message)
      }
    })
  }

  async function handleDeliver() {
    if (isShare.value) {
      return uploadRef.value.chooseFile()
    }
    if (store.getters['user/isLogin']) {
      if (talentList.value.length > 0) {
        router.push({
          path: '/talent',
          query: { jobId: detail.value.id, company: detail.value.companyName },
        })
      } else {
        uploadRef.value.chooseFile()
      }
    } else {
      uploadRef.value.chooseFile()
    }
  }

  async function judgeCanDelivery() {
    const result = await hrTalentList({ pageNo: 1, pageSize: 10 })
    if (result.code === 200) {
      talentList.value = result.result.records
    } else {
      Toast(result.message)
    }
  }

  onMounted(() => {
    getWxSign({
      url: window.location.href,
    }).then((res) => {
      const { result } = res
      console.log('info:', res.result)
      // eslint-disable-next-line no-undef
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: result.appId, // 必填，公众号的唯一标识
        timestamp: result.timestamp, // 必填，生成签名的时间戳
        nonceStr: result.nonceStr, // 必填，生成签名的随机串
        signature: result.signature, // 必填，签名
        jsApiList: [
          'updateTimelineShareData',
          'updateAppMessageShareData',
          'onMenuShareAppMessage',
        ], // 必填，需要使用的JS接口列表
      })
      // eslint-disable-next-line no-undef
      wx.error((res) => {
        console.log('微信错误：', res)
      })

      if (route.query.recommendCode) {
        getDetailsByShare()
      } else {
        getDetails()
      }
      if (store.getters['user/isLogin']) {
        judgeCanDelivery()
      }
    })
  })
</script>
<style scoped lang="less"></style>
