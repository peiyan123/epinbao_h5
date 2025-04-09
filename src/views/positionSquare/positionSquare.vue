<template>
  <!-- 职位广场 -->
  <div class="body">
    <van-sticky :offset-top="0">
      <van-nav-bar
        title="职位广场"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
      />

      <van-search
        v-model="jobName"
        @search="onSearch"
        placeholder="请输入搜索关键词"
      />
    </van-sticky>
    <!-- 筛选项 -->
    <van-dropdown-menu active-color="#1989fa" class="filter">
      <!-- 学历 -->
      <van-dropdown-item
        v-model="educationLevel"
        :options="educationLevelList"
        @change="changeFilter"
      />
      <!-- 工作地点 -->
      <van-dropdown-item
        v-model="workAddress"
        :options="workAddressList"
        @change="changeFilter"
      />
      <!-- 工作性质 -->
      <van-dropdown-item
        v-model="workNature"
        :options="workNatureList"
        @change="changeFilter"
      />

      <van-button
        plain
        type="primary"
        class="filter-reset"
        @click="resetFilter"
      >
        重置
      </van-button>
    </van-dropdown-menu>
    <van-empty description="暂无数据" v-if="list.length === 0" />
    <van-pull-refresh
      v-else
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="content" v-for="(item, index) in list" :key="index">
          <div class="content-left">
            <div class="content-left-name">{{ item.jobName }}</div>
            <div class="content-left-tags">
              <div>背景&nbsp;&nbsp;|&nbsp;&nbsp;</div>
              <div>{{ item.educationLevelReq }}&nbsp;&nbsp;|&nbsp;&nbsp;</div>
              <div>{{ item.workExpReq }}</div>
            </div>
            <div class="content-left-city">{{ item.workAddress }}</div>
          </div>
          <div class="content-right">
            <div class="content-right-salary">
              {{ item.minWage }}-{{ item.maxWage }} {{ item.wageUnit }}
            </div>
            <div class="content-right-btn">
              <van-button type="primary" @click="positionDetail(item.jobId)">
                投递简历
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>

    <van-overlay :show="showOverlay">
      <van-loading class="wrapper" type="spinner" color="#1989fa" vertical>
        加载中...
      </van-loading>
    </van-overlay>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import {
  NavBar,
  Search,
  PullRefresh,
  Button,
  Sticky,
  List,
  DropdownMenu,
  DropdownItem,
  Empty,
  Loading,
  Overlay,
} from "vant";
import { useRouter, useRoute } from "vue-router";
import { queryWxJobList } from "@/api/api";
export default {
  name: "PositionSquare",
  components: {
    [Button.name]: Button,
    [NavBar.name]: NavBar,
    [Search.name]: Search,
    [PullRefresh.name]: PullRefresh,
    [Sticky.name]: Sticky,
    [List.name]: List,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [Empty.name]: Empty,
    [Loading.name]: Loading,
    [Overlay.name]: Overlay,
  },
  setup() {
    // 控制遮罩层 加载状态出现遮罩层
    const showOverlay = ref(false);
    const list = ref([]);
    const loading = ref(false);
    const finished = ref(false);
    let pageNo = 1;
    // let controlLoading = true;
    const pageSize = 10;
    const onLoad = async () => {
      if (list.length >= 10) {
        showOverlay.value = true;
        // 获取数据
        pageNo++;
        await queryWxJobList({
          pageNo,
          pageSize,
          jobCategoryId,
          jobName: jobName.value,
        })
          .then((res) => {
            if (res.result.records.length === 0) {
              finished.value = true;
            } else {
              list.value = [...list.value, ...res.result.records];
            }
          })
          .catch()
          .finally(() => {
            showOverlay.value = false;
          });
      }
      // 加载状态结束
      loading.value = false;
    };
    let jobCategoryId = ""; //职位分类ID  传递给下一层 点击返回需要的参数
    onMounted(() => {
      const route = useRoute();
      jobCategoryId = route.query.id;
      showOverlay.value = true;
      queryWxJobList({
        pageNo,
        pageSize,
        jobCategoryId,
      })
        .then((res) => {
          if (res.success) {
            list.value = res.result.records;
          } else {
            Toast(res.message);
          }
        })
        .catch()
        .finally(() => {
          showOverlay.value = false;
        });
    });

    // 点击左侧返回 回到首页
    const router = useRouter();
    const onClickLeft = () => {
      router.push({ path: "/home" });
    };
    // 下拉刷新的状态
    const isLoading = ref(false);
    // 下拉触发的方法
    const onRefresh = async () => {
      showOverlay.value = true;
      pageNo = 1;
      await queryWxJobList({
        pageNo,
        pageSize,
        jobCategoryId,
        jobName: jobName.value,
        educationLevel: educationLevel.value,
        workAddress: workAddress.value,
        workNature: workNature.value,
      })
        .then((res) => {
          if (res.success) {
            list.value = res.result.records;
          } else {
            Toast(res.message);
          }
        })
        .catch()
        .finally(() => {
          showOverlay.value = false;
        });
      isLoading.value = false;
    };
    // 搜索绑定的数据
    const jobName = ref("");
    const onSearch = (jobName) => {
      showOverlay.value = true;
      pageNo = 1;
      queryWxJobList({
        pageNo,
        pageSize,
        jobCategoryId,
        jobName,
        educationLevel: educationLevel.value,
        workAddress: workAddress.value,
        workNature: workNature.value,
      })
        .then((res) => {
          if (res.success) {
            list.value = res.result.records;
          } else {
            Toast(res.message);
          }
        })
        .catch()
        .finally(() => {
          showOverlay.value = false;
        });
    };

    // 筛选项的选中项
    const educationLevel = ref("");
    const workAddress = ref("");
    const workNature = ref("");
    // 重置筛选项
    const resetFilter = () => {
      showOverlay.value = true;
      educationLevel.value = "";
      workAddress.value = "";
      workNature.value = "";
      jobName.value = "";
      pageNo = 1;
      queryWxJobList({
        pageNo,
        pageSize,
        jobCategoryId,
      })
        .then((res) => {
          if (res.success) {
            list.value = res.result.records;
          } else {
            Toast(res.message);
          }
        })
        .catch()
        .finally(() => {
          showOverlay.value = false;
        });
    };
    //改变筛选项
    const changeFilter = () => {
      showOverlay.value = true;
      pageNo = 1;
      queryWxJobList({
        pageNo,
        pageSize,
        jobCategoryId,
        jobName: jobName.value,
        educationLevel: educationLevel.value,
        workAddress: workAddress.value,
        workNature: workNature.value,
      })
        .then((res) => {
          if (res.success) {
            list.value = res.result.records;
          } else {
            Toast(res.message);
          }
        })
        .catch()
        .finally(() => {
          showOverlay.value = false;
        });
    };
    // 筛选项的选项
    const educationLevelList = [
      { text: "学历", value: "" },
      { text: "大专", value: "大专" },
      { text: "本科", value: "本科" },
      { text: "硕士", value: "硕士" },
      { text: "博士", value: "博士" },
    ];
    const workAddressList = [
      { text: "工作地点", value: "" },
      { text: "上海", value: "上海" },
      { text: "北京", value: "北京" },
      { text: "成都", value: "成都" },
      { text: "重庆", value: "重庆" },
      { text: "沈阳", value: "沈阳" },
      { text: "南京", value: "南京" },
      { text: "广州", value: "广州" },
      { text: "长春", value: "长春" },
      { text: "武汉", value: "武汉" },
      { text: "深圳", value: "深圳" },
      { text: "大连", value: "大连" },
      { text: "苏州", value: "苏州" },
      { text: "底特律", value: "底特律" },
      { text: "扬州", value: "扬州" },
      { text: "天津", value: "天津" },
      { text: "柏林", value: "柏林" },
      { text: "保定", value: "保定" },
      { text: "合肥", value: "合肥" },
      { text: "宁波", value: "宁波" },
      { text: "惠州", value: "惠州" },
    ];
    const workNatureList = [
      { text: "工作性质", value: "" },
      { text: "兼职人员", value: "兼职人员" },
      { text: "劳务人员", value: "劳务人员" },
      { text: "外协人员", value: "外协人员" },
      { text: "实习生", value: "实习生" },
      { text: "正式员工", value: "正式员工" },
    ];
    // 投递简历进入简历详情
    const positionDetail = (jobId) => {
      router.push({
        name: `positionDetail`,
        query: {
          jobId,
        },
      });
    };
    return {
      onClickLeft,
      isLoading,
      onRefresh,
      jobName,
      positionDetail,
      list,
      loading,
      finished,
      onLoad,
      onSearch,
      educationLevel,
      workAddress,
      workNature,
      educationLevelList,
      workAddressList,
      workNatureList,
      resetFilter,
      changeFilter,
      showOverlay,
    };
  },
};
</script>

<style lang="less" scoped>
/deep/.van-sticky--fixed {
  background-color: #fff;
}
.body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5;
}
.van-pull-refresh {
  flex: 1;
}
.content {
  display: flex;
  justify-content: space-between;

  margin-top: 6px;
  padding: 10px 12px;
  background-color: #fff;
  .content-left {
    .content-left-name {
      font-size: 19px;
      font-weight: 600;
    }
    .content-left-tags {
      display: flex;
      align-items: center;
      margin: 6px 0;
      color: #919191;
    }
  }
  .content-right {
    display: flex;
    flex-direction: column;
    .content-right-salary {
      color: #da3564;
      font-weight: 600;
    }

    .content-right-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    // 修改按钮样式
    .van-button--normal {
      height: 34px;
      border-radius: 6px;
    }
  }
}
.filter {
  display: flex;
  align-items: center;
  padding-right: 12px;
  background-color: #fff;
  /deep/.van-dropdown-menu__bar {
    flex: 1;
  }
  .filter-reset {
    margin-left: 12px;
    height: 30px;
  }
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>>
