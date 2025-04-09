<template>
  <!-- 职位详情 -->
  <div class="body">
    <van-sticky :offset-top="0">
      <van-nav-bar
        title="职位详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />
    </van-sticky>

    <div class="content">
      <div class="content-top">
        <div>
          <div class="content-top-name">{{ detail.jobName }}</div>
          <div class="content-top-class">
            职位分类：{{ detail.jobCategoryName }}
          </div>
          <div class="content-top-nature">
            工作性质：{{ detail.workNature }}
          </div>
        </div>
        <div class="content-top-right">
          <div class="content-top-right-salary">
            {{ detail.minWage }}-{{ detail.maxWage }} {{ detail.wageUnit }}
          </div>
        </div>
      </div>
      <!-- 分隔线 -->
      <van-divider :style="{ color: '#dadada', borderColor: '#dadada' }" />
      <div class="content-main">
        <!-- 招聘描述 -->
        <div class="content-main-title">招聘描述</div>
        <div class="content-main-detail">
          {{ detail.jobDescription }}
        </div>
        <!-- 要求 -->
        <div class="content-main-title require">要求</div>
        <div class="content-main-detail">
          {{ detail.jobRequirement }}
        </div>
      </div>
      <!-- 按钮 -->
      <!-- 设置0.5防止拖动的时候按钮会抖一下 -->
      <van-sticky position="bottom" :offset-bottom="0.5">
        <div class="content-btn">
          <van-button type="primary" @click="sendResume">投递简历</van-button>
        </div>
      </van-sticky>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from "vue";
import { NavBar, Button, Divider, Sticky, Toast } from "vant";
import { useRouter, useRoute } from "vue-router";
import { queryWxJobDetailById } from "@/api/api";
import { useStore } from "vuex";
export default {
  name: "positionDetail",
  components: {
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Divider.name]: Divider,
    [Sticky.name]: Sticky,
    [Toast.name]: Toast,
  },
  setup() {
    // 点击返回 回到进入之前的页面
    const router = useRouter();
    const onClickLeft = () => {
      router.go(-1);
    };
    let jobId = "";
    const detail = reactive({ detail: {} });
    onMounted(() => {
      const route = useRoute();
      jobId = route.query.jobId;
      queryWxJobDetailById(route.query)
        .then((res) => {
          if (res.success) {
            detail.detail = res.result;
          } else {
            Toast(res.message);
          }
        })
        .catch();
    });

    // 点击投递简历 进入填写简历界面
    const store = useStore();
    const sendResume = () => {
      console.log(store.state.user.userInfo.token);
      if (!store.state.user.userInfo.token) {
        let fullPath = "/sendResume?jobId=" + jobId;
        console.log(fullPath);
        router.push("/login?redirectUrl=" + fullPath);
      } else {
        router.push({
          path: "/sendResume",
          query: {
            jobId,
          },
        });
      }
    };
    return {
      onClickLeft,
      sendResume,
      ...toRefs(detail),
    };
  },
};
</script>

<style lang="less" scoped>
.body {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 12px;
    background-color: #fff;
    .content-top {
      padding: 12px 12px 0;
      display: flex;
      justify-content: space-between;
      .content-top-name {
        font-size: 20px;
        font-weight: 600;
      }
      .content-top-class {
        margin: 6px 0;
        color: #919191;
      }
      .content-top-right {
        display: flex;
        align-items: center;
        .content-top-right-salary {
          color: #da3564;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    .content-main {
      flex: 1;
      padding: 0 12px;
      .content-main-title {
        padding: 10px 0;
        font-size: 16px;
        font-weight: 600;
      }
      .content-main-title::before {
        margin-right: 4px;
        display: inline-block;
        content: "";
        width: 2px;
        height: 12px;
        background-color: #1989fa;
      }
      .content-main-detail {
        color: #bcbcbc;
      }
      .require {
        margin-top: 16px;
      }
    }
    .content-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      background-color: #fff;
      .van-button {
        width: 50%;
      }
    }
  }
}
</style>>
