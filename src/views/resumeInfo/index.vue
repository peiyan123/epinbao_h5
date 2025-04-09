<template>
  <div class="min-h-100vh">
    <Sticky :offset-top="0">
      <div class="px-60px flex justify-center py-80px relative bg-white">
        <span class="font-size-56px">简历信息确认</span>
        <div
          class="i-epinbao-left-arrow w-57px cursor-pointer absolute top-100px left-60px"
          @click="handleBack"
        ></div>
      </div>
    </Sticky>
    <div class="pb-290px">
      <Form class="my-form" ref="form">
        <Divider class="text-primary border-primary font-size-48px px-60px">基本信息</Divider>
        <CellGroup inset>
          <Field
            required
            :rules="[{ required: true, message: '请填写姓名' }]"
            v-model="resumeInfo.name"
            label="姓名"
            placeholder="请填写姓名"
          />

          <Field
            required
            :rules="[{ required: true, message: '请选择出生日期' }]"
            readonly
            v-model="resumeInfo.birthDate"
            @click="resumeInfo.birthDateVisible = true"
            label="出生日期"
            placeholder="请选择出生日期"
          />

          <Popup position="bottom" v-model:show="resumeInfo.birthDateVisible">
            <DatetimePicker
              :minDate="minDate"
              :maxDate="maxDate"
              type="date"
              v-model="resumeInfo.birthDate"
              @confirm="chooseBirthDateConfirm"
              @cancel="resumeInfo.birthDateVisible = false"
            />
          </Popup>

          <Field
            required
            :rules="[
              { required: true, message: '请填写手机号码' },
              { pattern: PHONE_REG, message: '请填写正确的手机号' },
            ]"
            v-model="resumeInfo.phone"
            label="手机号码"
            placeholder="请填写手机号码"
          />
          <Field
            required
            v-model="resumeInfo.email"
            label="邮箱"
            placeholder="请填写邮箱"
            :rules="[
              { required: true, message: '请填写邮箱' },
              { pattern: EMAIL_REG, message: '请填写正确的邮箱' },
            ]"
          />
          <Field
            required
            :rules="[{ required: true, message: '请选择简历来源' }]"
            label="简历来源"
            readonly
            placeholder="请选择简历来源"
            @click="resumeSourceVisible = true"
            v-model="resumeInfo.source"
          />
          <Popup position="bottom" v-model:show="resumeSourceVisible">
            <Picker
              :columns="resumeSourceList"
              @confirm="handleResumeSource"
              @cancel="resumeSourceVisible = false"
            />
          </Popup>
        </CellGroup>
        <Divider class="text-primary border-primary font-size-48px px-60px">工作经历</Divider>
        <CellGroup inset>
          <div v-for="(item, index) in jobExpList" :key="index">
            <div class="flex items-center justify-between">
              <Tag type="primary" round size="large">工作经历{{ index + 1 }}</Tag>
              <div class="flex items-center">
                <van-icon
                  name="delete-o"
                  size="23px"
                  @click="deleteJobExp(index)"
                  v-if="index !== 0"
                  class="text-primary"
                />
                <van-icon
                  class="ml-30px text-primary"
                  name="add-o"
                  size="23px"
                  v-if="index == jobExpList.length - 1"
                  @click="addJobExp"
                />
              </div>
            </div>
            <Field
              required
              :rules="[{ required: true, message: '请选择开始时间' }]"
              label="开始时间"
              readonly
              placeholder="请选择开始时间"
              @click="item.startExpVisible = true"
              v-model="item.startMonth"
            />
            <Popup position="bottom" v-model:show="item.startExpVisible">
              <DatetimePicker
                :minDate="minDate"
                :maxDate="maxDate"
                type="date"
                v-model="item.startMonthDate"
                @confirm="chooseDateConfirm($event, item, 'startMonth')"
                @cancel="item.startExpVisible = false"
              />
            </Popup>
            <Field
              required
              :rules="[{ required: true, message: '请选择结束时间' }]"
              label="结束时间"
              readonly
              placeholder="请选择结束时间"
              @click="item.endExpVisible = true"
              v-model="item.endMonth"
            />
            <Popup position="bottom" v-model:show="item.endExpVisible">
              <DatetimePicker
                :minDate="minDate"
                :maxDate="maxDate"
                type="date"
                v-model="item.endMonthDate"
                @confirm="chooseDateConfirm($event, item, 'endMonth')"
                @cancel="item.endExpVisible = false"
              />
            </Popup>
            <Field
              required
              :rules="[{ required: true, message: '请填写工作单位' }]"
              v-model="item.companyName"
              label="工作单位"
              placeholder="请填写工作单位"
            />
            <Field
              required
              :rules="[{ required: true, message: '请填写职位' }]"
              v-model="item.position"
              label="职位"
              placeholder="请填写职位"
            />
            <Field
              required
              :rules="[{ required: true, message: '请填写工作内容' }]"
              v-model="item.jobDescription"
              label="工作内容"
              placeholder="请填写工作内容"
              type="textarea"
              autosize
              rows="3"
            />
          </div>
        </CellGroup>
      </Form>
    </div>
    <div class="fixed bottom-0 left-0 right-0 px-60px h-290px flex items-center bg-white">
      <Button
        :loading="btnLoading"
        class="h-140px font-size-45px"
        size="small"
        type="primary"
        round
        block
        @click="handleConfirm"
        >确认</Button
      >
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  // hooks
  import { useStore } from 'vuex'
  import { useRouter, useRoute } from 'vue-router'
  import { cloneDeep, forIn, pick } from 'lodash'
  import { PHONE_REG, EMAIL_REG, DATEFORMAT } from '@/constant'
  import dayjs from 'dayjs'
  // components
  import {
    Tag,
    Divider,
    Sticky,
    CellGroup,
    Field,
    Form,
    Toast,
    Picker,
    Popup,
    Button,
    DatetimePicker,
  } from 'vant'
  // api
  import {
    resumeSourceListApi,
    verifyResume,
    verifyResumeHunter,
    addResume,
    addResumeHunter,
    addCandidate,
    addCandidateHunter,
    candidateIdAndResumeIdApi,
  } from '@/api/api'

  const btnLoading = ref(false)
  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const resumeSourceVisible = ref(false)
  const resumeSourceList = ref([])
  const originalSourceList = ref([])
  console.log(store.state.user.uploadInfo)
  const minDate = new Date(1993, 0, 1)
  const maxDate = new Date()
  const checkField = [
    'hrResumeJobExpList',
    'hrResumeProjectExpList',
    'hrResumeEducationExpList',
    'hrResumeLanguageDegreeList',
    'hrResumeJobSkillList',
    'hrResumeTrainingList',
    'hrResumeCredentialList',
  ]
  const form = ref()
  const resumeInfo = ref({
    name: '',
    phone: '',
    email: '',
    source: '外部推荐',
    sourceId: '7',
    birthDate: '',
  })
  const jobExpListItem = {
    companyName: '',
    startMonth: '',
    startMonthDate: null,
    endMonth: '',
    endMonthDate: null,
    jobDescription: '',
    position: '',
    startExpVisible: false,
    endExpVisible: false,
  }
  const jobExpList = ref()
  function handleBack() {
    router.back()
  }

  function handleEchoData() {
    resumeInfo.value.name = store.state.user.uploadInfo.name
    resumeInfo.value.phone = store.state.user.uploadInfo.phone
    resumeInfo.value.email = store.state.user.uploadInfo.email
    const expList =
      cloneDeep(store.state.user.uploadInfo.hrResumeJobExpList) || cloneDeep(jobExpListItem)
    expList.forEach((item) => {
      item.startMonth = dayjs(item.startMonth).format(DATEFORMAT)
      item.endMonth = dayjs(item.endMonth).format(DATEFORMAT)
      item.startMonthDate = new Date(item.startMonth)
      item.endMonthDate = new Date(item.endMonth)
      item.startExpVisible = false
      item.endExpVisible = false
    })

    jobExpList.value = expList
  }
  function handleResumeSource(value, item) {
    console.log(value, item)
    resumeInfo.value.source = value
    resumeInfo.value.sourceId = originalSourceList.value.find((a) => a.name === value).id
    resumeSourceVisible.value = false
  }

  async function getResumeSourceList() {
    const res = await resumeSourceListApi()
    if (res.code === 200) {
      originalSourceList.value = res.result
      resumeSourceList.value = res.result.map((item) => item.name)
    } else {
      Toast(res.message)
    }
  }

  async function handleConfirm() {
    await form.value.validate()
    try {
      btnLoading.value = true

      const uploadInfo = cloneDeep(store.state.user.uploadInfo)
      forIn(uploadInfo, (value, key) => {
        if (checkField.includes(key) && !value) {
          uploadInfo[key] = []
        }
      })

      let res1
      if (store.state.user.recommendCode) {
        res1 = await verifyResumeHunter(
          { ...uploadInfo, ...resumeInfo.value },
          store.state.user.recommendCode,
        )
      } else {
        res1 = await verifyResume({ ...uploadInfo, ...resumeInfo.value })
      }

      if (res1.code !== 200) return Toast(res1.message)

      uploadInfo.repeatType = '相似'
      uploadInfo.hrResumeJobExpList = jobExpList.value.map((item) => {
        return pick(item, ['companyName', 'startMonth', 'endMonth', 'jobDescription', 'position'])
      })

      let res2
      let res3
      if (store.state.user.recommendCode) {
        res2 = await addResumeHunter(
          {
            ...uploadInfo,
            ...resumeInfo.value,
            candidateStatus: 'DCS',
            hrRecruitJobId: route.query.id,
          },
          store.state.user.recommendCode,
        )
        res3 = await addCandidateHunter(
          {
            hrResumeId: res2.result,
            jobId: route.query.id,
            status: 'DCS',
          },
          store.state.user.recommendCode,
        )
        Toast('投递成功')
      } else {
        res2 = await addResume([{ ...uploadInfo, ...resumeInfo.value }])
        res3 = await addCandidate({
          hrResumeId: res2.result,
          jobId: route.query.id,
          status: 'DCS',
        })
        Toast('确认成功')
        router.push({
          path: '/talent',
        })
      }

      if (res2.code !== 200) return Toast(res2.message)
      // const res3 = await candidateIdAndResumeIdApi({ hrResumeId: res2.result[0] })
      // if (res3.code !== 200) return Toast(res3.message)
      // const res4 = await addCandidate({
      //   candidateId: res3.result.candidateId,
      //   hrResumeId: res3.result.hrResumeId,
      //   jobId: route.query.id,
      //   status: 'DCS',
      // })
      // if (res4.code !== 200) return Toast(res4.message)
    } finally {
      btnLoading.value = false
    }
  }

  function chooseDateConfirm(value, item, type) {
    item[type] = dayjs(value).format(DATEFORMAT)
    item.startExpVisible = false
  }
  function chooseBirthDateConfirm(value) {
    resumeInfo.value.birthDate = dayjs(value).format(DATEFORMAT)
    resumeInfo.value.birthDateVisible = false
  }
  function deleteJobExp(index) {
    jobExpList.value.splice(index, 1)
  }
  function addJobExp() {
    jobExpList.value.push(cloneDeep(jobExpListItem))
  }

  onMounted(() => {
    getResumeSourceList()
    handleEchoData()
  })
</script>
<style scoped lang="less">
  :deep(.my-form) {
    .van-cell {
      font-size: 42px;
      padding-top: 50px;
      padding-bottom: 50px;
      textarea {
        border: 1px solid var(--van-cell-border-color);
        padding: 15px 20px;
        border-radius: 20px;
      }
    }
  }
</style>
