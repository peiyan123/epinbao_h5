<template>
  <!-- 个人中心 -->
  <div class="body">
    <van-sticky :offset-top="0">
      <van-nav-bar
        title="个人中心"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>
    <!-- 用户信息 -->
    <div class="user-info">
      <img class="user-img" src="@/assets/images/personn.png" alt="" />
      <div class="user-name">&nbsp;&nbsp;用户</div>
      <div class="user-name">
        &nbsp;({{ $store.state.user.userInfo.userInfo.phone }})
      </div>
    </div>
    <!-- 投递进度 -->
    <div class="deliver-progress">
      <div class="deliver-progress-title">投递进度</div>
      <van-loading
        v-if="loading"
        class="wrapper"
        type="spinner"
        color="#1989fa"
        vertical
      >
        加载中...
      </van-loading>
      <div v-else>
        <van-empty description="暂无数据" v-if="list.length === 0" />
        <div
          v-else
          class="deliver-progress-content"
          v-for="(item, index) in list"
          :key="index"
        >
          <div
            class="deliver-progress-content-name"
            @click="jumpJob(item.hrRecruitJobId)"
          >
            {{ item.jobName }}
          </div>
          <div>{{ item.operateTime.substring(0, 10) }}</div>
          <div class="deliver-progress-content-state">
            {{ item.candidateStatus }}
          </div>
        </div>
      </div>
    </div>
    <!-- 退出登录 -->
    <!-- 按钮 -->
    <van-sticky position="bottom" :offset-bottom="0.5">
      <div class="exit-btn">
        <van-button type="primary" size="large" @click="exitLogin">
          退出登录
        </van-button>
      </div>
    </van-sticky>
  </div>
</template>

<script>
import { NavBar, Button, Sticky, Empty, Loading } from "vant";
import { useRouter } from "vue-router";
import { addCandidateList } from "@/api/api";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "personalCenter",
  components: {
    [NavBar.name]: NavBar,
    [Button.name]: Button,
    [Sticky.name]: Sticky,
    [Empty.name]: Empty,
    [Loading.name]: Loading,
  },
  setup() {
    // 点击左侧返回 回到首页
    const router = useRouter();
    const onClickLeft = () => {
      router.push({ path: "/home" });
    };

    const list = ref([]);
    const loading = ref(false);
    onMounted(() => {
      loading.value = true;
      addCandidateList()
        .then((res) => {
          if (res.success) {
            list.value = res.result.records;
          } else {
            Toast(res.message);
          }
        })
        .catch(() => {})
        .finally(() => {
          loading.value = false;
        });
    });

    const jumpJob = (hrRecruitJobId) => {
      router.push(`/positionDetail?jobId=${hrRecruitJobId}`);
    };

    const store = useStore();
    // 退出登录
    const exitLogin = () => {
      // 跳转到首页
      router.push({ path: "/home" });
      // 清空个人信息
      store.commit("user/setUser", {});
    };

    return {
      onClickLeft,
      exitLogin,
      list,
      loading,
      jumpJob,
    };
  },
};
</script>

<style lang="less" scoped>
.body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  .user-info {
    display: flex;
    align-items: center;
    padding: 18px 24px;
    height: 50px;
    .user-img {
      height: 100%;
    }
  }
  .deliver-progress {
    flex: 1;
    padding: 18px 24px 0;
    .deliver-progress-title {
      font-size: 18px;
      color: #b5b3ba;
    }
    .deliver-progress-content {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .deliver-progress-content-name {
        width: 40%;
        color: #0091ff;
      }
      .deliver-progress-content-state {
        text-align: right;
        width: 25%;
      }
    }
  }
  .exit-btn {
    background-color: #fff;
    padding: 18px 24px;
  }
  .wrapper {
    margin-top: 16px;
  }
}
</style>>
