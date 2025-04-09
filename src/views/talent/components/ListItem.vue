<template>
  <div class="bg-white mb-36px relative flex">
    <div class="flex-1 px-45px py-80px">
      <div class="flex items-center justify-between">
        <span class="font-size-56px font-semibold van-ellipsis w-200px">{{ data.name }}</span>
        <span class="text-primary font-size-42px van-ellipsis w-400px">{{
          data.latestPosition
        }}</span>
      </div>
      <!-- <div class="flex items-center flex-wrap mt-32px">
      <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray">{{
        data.workAddress
      }}</div>
      <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray">{{
        data.educationLevelReq
      }}</div>
      <div class="p-8px bg-custom-gray font-size-36px mr-16px text-custom-gray"
        >{{ data.workExpReq }}年</div
      >
    </div> -->
      <div class="van-multi-ellipsis--l2 w-700px mt-42px text-custom-gray">{{
        data.skillName
      }}</div>
    </div>
    <div class="w-184px bg-#3BA8FF flex justify-center items-center" @click="handleDeliver">
      <span class="font-size-42px text-color-white">投递</span>
    </div>
  </div>
  <Overlay :show="showOverlay">
    <div class="h-full flex justify-center items-center">
      <Loading type="spinner" color="#1989fa" vertical> 加载中... </Loading>
    </div>
  </Overlay>
  <Popup position="bottom" v-model:show="positionCompanyVisible">
    <Picker
      :loading="loading"
      :title="pickTitle"
      :columns="positionCompanyList"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </Popup>
</template>

<script setup>
  import { defineProps, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  // components
  import { SwipeCell, Button, Overlay, Loading, Popup, Picker, Toast } from 'vant'
  // api
  import { getCanUseCompanys, getCanUseJobs, addCandidate } from '@/api/api'

  const props = defineProps({
    data: { type: Object, default: () => {} },
    company: { type: String, default: '' },
    jobId: { type: String, default: '' },
  })
  const router = useRouter()
  const positionCompanyVisible = ref(false)
  const positionCompanyList = ref([])
  const originalPositionList = ref([])
  const showOverlay = ref(false)
  const loading = ref(false)
  const pickTitle = ref('公司')
  const submitData = reactive({
    company: '',
    jobId: '',
  })
  function handleCancel() {
    positionCompanyVisible.value = false
    pickTitle.value = '公司'
  }
  function handleConfirm(value) {
    console.log(value)
    if (pickTitle.value === '公司') {
      submitData.company = value.value
      getCanUseJobs({ companyName: value.value, hrCandidateId: props.data.hrResumeId })
        .then((res) => {
          loading.value = true
          if (res.code === 200) {
            pickTitle.value = '职位'
            originalPositionList.value = res.result
            positionCompanyList.value = res.result.map((item) => {
              return { text: item.jobName, value: item.id }
            })
          } else {
            Toast(res.message)
          }
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false
        })
    } else {
      submitData.jobId = value.value
      pickTitle.value = '公司'
      positionCompanyVisible.value = false
      handleAddCandidate(submitData.company, submitData.jobId)
    }
  }
  async function handleAddCandidate(company, jobId) {
    const res = await addCandidate({
      company,
      jobId,
      hrResumeId: props.data.hrResumeId,
      status: 'DCS',
    })
    if (res.code !== 200) return Toast(res.message)
    Toast('投递成功')
    if (props.company && props.jobId) {
      router.back()
    } else {
      router.push({ path: '/home' })
    }
  }

  async function handleDeliver() {
    if (props.company && props.jobId) {
      return handleAddCandidate(props.company, props.jobId)
    }
    try {
      showOverlay.value = true
      const res1 = await getCanUseCompanys({ hrCandidateId: props.data.hrResumeId })
      if (res1.code !== 200) return Toast(res1.message)
      positionCompanyVisible.value = true
      positionCompanyList.value = res1.result.map((item) => {
        return { text: item, value: item }
      })
    } finally {
      showOverlay.value = false
    }
  }
  async function beforeClose({ position }) {
    if (position === 'right' && props.company && props.jobId) {
      return handleAddCandidate(props.company, props.jobId)
    }
    if (position === 'right') {
      try {
        showOverlay.value = true
        const res1 = await getCanUseCompanys({ hrCandidateId: props.data.hrResumeId })
        if (res1.code !== 200) return Toast(res1.message)
        positionCompanyVisible.value = true
        positionCompanyList.value = res1.result.map((item) => {
          return { text: item, value: item }
        })
      } finally {
        showOverlay.value = false
      }
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
