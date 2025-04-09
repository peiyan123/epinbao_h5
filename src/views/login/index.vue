<template>
  <div class="px-80px h-100vh bg-default">
    <div class="h-38px py-60px">
      <div class="i-epinbao-left-arrow w-57px cursor-pointer" @click="handleRegister"></div>
    </div>
    <div class="font-size-88px mt-20px">个人登录-易聘宝</div>
    <div class="i-epinbao-title w-414px h-133px mx-auto mt-255px"> </div>
    <Form @submit="onSubmit" ref="form" class="mt-255px login-form">
      <CellGroup inset class="bg-default m-0">
        <Field
          v-model="phone"
          type="digit"
          name="phone"
          placeholder="请输入手机号"
          :rules="[
            { required: true, message: '请填写手机号' },
            { pattern: phonePattern, message: '请填写正确的手机号' },
          ]"
          class="font-size-50px py-45px rounded-36px"
        >
          <template #left-icon>
            <div class="i-epinbao-phone w-74px h-74px"> </div>
          </template>
        </Field>
        <Field
          class="mt-126px py-38px font-size-50px rounded-36px"
          v-model="captcha"
          type="digit"
          name="captcha"
          placeholder="请输入验证码"
          maxlength="6"
          :rules="[
            { required: true, message: '请填写验证码' },
            { pattern: captchaPattern, message: '请填写正确的验证码' },
          ]"
        >
          <template #left-icon>
            <div class="i-epinbao-smile w-74px h-74px"> </div>
          </template>
          <template #button>
            <Button
              class="border-none font-size-50px"
              size="small"
              plain
              type="primary"
              @click="sendCode"
              :disabled="!sendCaptcha"
            >
              {{ sendCaptcha ? '获取验证码' : `重新发送 ${resetTime}` }}
            </Button>
          </template>
        </Field>
      </CellGroup>
      <div class="mt-126px">
        <Button
          class="rounded-70px font-size-45px h-144px"
          block
          :loading="loading"
          loading-text="登录中..."
          type="primary"
          native-type="submit"
        >
          登录
        </Button>
      </div>
    </Form>
    <div>
      <Button
        type="primary"
        block
        plain
        class="border-none font-size-50px bg-transparent mt-126px"
        @click="handleRegister"
      >
        立即注册
      </Button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  // components
  import { Form, CellGroup, Button, Field, Toast } from 'vant'
  // api
  import { sendSms, smsLogin } from '@/api/api'
  // hooks
  import { useStore } from 'vuex'
  import { useRoute, useRouter } from 'vue-router'

  const form = ref()
  const phone = ref()
  const captcha = ref()
  const loading = ref(false)
  const phonePattern = /^1[3456789]\d{9}$/
  const captchaPattern = /\d{6}/
  const resetTime = ref(60)
  const sendCaptcha = ref(true)
  const store = useStore()
  const redirectUrl = ref('')
  const router = useRouter()
  async function sendCode() {
    try {
      await form.value.validate('phone')
      const res = await sendSms({
        phone: phone.value,
      })
      if (res.code === 200) {
        Toast(res.message)
        let timer = null
        sendCaptcha.value = false
        timer = setInterval(() => {
          resetTime.value--
          if (resetTime.value === 0) {
            clearInterval(timer)
            sendCaptcha.value = true
            resetTime.value = 60
          }
        }, 1000)
      } else {
        Toast(res.message)
      }
    } catch (error) {}
  }
  async function onSubmit(values) {
    // router.push(redirectUrl.value || '/home')
    // return
    loading.value = true
    try {
      const res = await smsLogin(values)
      if (res.code === 200) {
        store.commit('user/setRecommendCode', '')
        store.commit('user/setUser', res.result)
        Toast(res.message)
        setTimeout(() => {
          // if (store.state.user.userInfo.userInfo.recommendCode) {
          // } else {
          // }
          router.push(redirectUrl.value || '/home')
        }, 1000)
      } else {
        Toast(res.message)
      }
    } finally {
      loading.value = false
    }
  }

  function handleRegister() {
    router.push('/register')
  }

  onMounted(() => {
    const route = useRoute()
    redirectUrl.value = route.query.redirectUrl
  })
</script>
<style lang="less" scoped>
  .bg-default {
    background: rgba(241, 242, 246, 1);
  }
</style>
<style lang="less">
  .login-form {
    .van-field__body {
      height: 100%;
    }
    .van-field__left-icon {
      margin-right: 35px;
    }
    .van-field__error-message {
      position: absolute;
      font-size: 45px;
      top: 115px;
    }
    .van-cell {
      overflow: visible;
    }
    .van-cell-group--inset {
      overflow: visible;
    }
  }
</style>
