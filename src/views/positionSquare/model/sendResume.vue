<template>
  <!-- 投递简历 -->
  <div>
    <van-nav-bar
      title="投递简历"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 附件简历 -->
    <div class="title">
      <div class="title-text">附件简历</div>
    </div>
    <!-- 上传简历 -->
    <van-uploader
      accept=".docx,.pdf"
      v-model="fileList"
      :after-read="afterRead"
      :max-count="1"
    >
      <div class="up-load-icon">
        <van-icon name="description" />
      </div>
      <div class="up-load-middle">上传并解析附件简历</div>
      <div class="up-load-bottom">支持格式：PDF、DOCX</div>
      <template #preview-cover="{ file }">
        <!-- {{ file }} -->
        <!-- <div class="preview-cover van-ellipsis">{{ file.name }}</div> -->
      </template>
    </van-uploader>

    <!-- 表单内容 -->
    <div>
      <!-- 信息表单 -->
      <van-form @submit="onSubmit">
        <!-- 基本信息 -->
        <div class="title">
          <div class="title-text">基本信息</div>
        </div>
        <van-cell-group inset>
          <!-- 姓名 -->
          <van-field
            v-model="form.name"
            required
            label="姓名"
            placeholder="请填写姓名"
            :rules="[{ required: true, message: '请填写姓名' }]"
          />
          <!-- 手机号码 -->
          <van-field
            v-model="form.phone"
            required
            label="手机号码"
            placeholder="请填写手机号码"
            :rules="[
              { required: true, message: '请填写手机号' },
              { pattern: phonePattern, message: '请填写正确的手机号' },
            ]"
          />
          <!-- 邮箱 -->
          <van-field
            v-model="form.email"
            required
            label="邮箱"
            placeholder="请填写邮箱"
            :rules="[{ required: true, message: '请填写邮箱' }]"
          />
          <!-- 期望城市 -->
          <van-field
            v-model="form.expectCity"
            required
            label="期望城市"
            placeholder="请填写期望城市"
            :rules="[{ required: true, message: '请填写期望城市' }]"
          />
          <!-- 性别 -->
          <van-field
            v-model="form.sex"
            is-link
            readonly
            label="性别"
            placeholder="请选择性别"
            @click="sexPicker = true"
          />
          <van-popup v-model:show="sexPicker" position="bottom">
            <van-picker
              :columns="columns"
              @confirm="sexConfirm"
              @cancel="sexPicker = false"
            />
          </van-popup>
          <!-- 政治面貌 -->
          <van-field
            v-model="form.politicsStatus"
            label="政治面貌"
            placeholder="请填写政治面貌"
          />
          <!-- 出生年月 -->
          <van-field
            v-model="form.birthDate"
            is-link
            readonly
            label="出生年月"
            placeholder="请选择出生年月"
            @click="birthDatePicker = true"
          />
          <van-popup v-model:show="birthDatePicker" position="bottom">
            <van-datetime-picker
              type="date"
              v-model="nowDate"
              @confirm="birthDateConfirm"
              @cancel="birthDatePicker = false"
              :min-date="minDate"
              :max-date="maxDate"
            />
          </van-popup>
          <!-- 期望薪资 -->
          <van-field
            v-model="form.salaryMin"
            label="期望薪资"
            :placeholder="form.salaryType ? '' : '请填写期望薪资'"
            :disabled="form.salaryType"
          >
            <!-- 右侧 薪资单位 是否面议 -->
            <template #extra>
              <div class="expectPosition-right">
                <!-- 薪资单位 -->
                <div
                  class="expectPosition-right-unit"
                  @click="salaryUnitPicker = true"
                >
                  {{ form.salaryUnit }}
                </div>
                <van-popup v-model:show="salaryUnitPicker" position="bottom">
                  <van-picker
                    :columns="salaryUnitList"
                    @confirm="salaryUnitConfirm"
                    @cancel="salaryUnitPicker = false"
                  />
                </van-popup>
                <!-- 是否面议 -->
                <div>
                  <van-checkbox
                    v-model="form.salaryType"
                    shape="square"
                    @change="salaryTypeChange"
                  >
                    面议
                  </van-checkbox>
                </div>
              </div>
            </template>
          </van-field>
        </van-cell-group>

        <!-- 教育经历信息 -->
        <div class="title can-add">
          <div class="title-text">教育经历</div>
          <div
            v-if="form.hrResumeEducationExpList.length == 0"
            class="add-function"
            @click="addExperience('hrResumeEducationExpList')"
          >
            <van-icon name="plus" />
            添加
          </div>
        </div>
        <van-cell-group inset>
          <div
            v-for="(item, index) in form.hrResumeEducationExpList"
            :key="index"
          >
            <!-- 学校名称 -->
            <van-field
              v-model="item.schoolName"
              label="学校名称"
              placeholder="请填写学校名称"
            />
            <!-- 学历 -->
            <van-field
              v-model="item.educationLevel"
              is-link
              readonly
              label="学历"
              placeholder="请选择学历"
              @click="item.educationLevelPicker = true"
            />
            <van-popup
              v-model:show="item.educationLevelPicker"
              position="bottom"
            >
              <van-picker
                :columns="educationLevelList"
                @confirm="educationLevelConfirm($event, item)"
                @cancel="item.educationLevelPicker = false"
              />
            </van-popup>
            <!-- 专业 -->
            <van-field
              v-model="item.major"
              label="专业"
              placeholder="请填写专业"
            />
            <!-- 开始时间 -->
            <van-field
              v-model="item.startDate"
              is-link
              readonly
              label="开始时间"
              placeholder="请选择开始时间"
              @click="item.startPicker = true"
            />
            <van-popup v-model:show="item.startPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.startNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'startDate',
                    'endDate',
                    'startPicker'
                  )
                "
                @cancel="item.startPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 结束时间 -->
            <van-field
              v-model="item.endDate"
              is-link
              readonly
              label="结束时间"
              placeholder="请选择开始时间"
              @click="item.stopPicker = true"
            />
            <van-popup v-model:show="item.stopPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.endNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'endDate',
                    'startDate',
                    'stopPicker'
                  )
                "
                @cancel="item.stopPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeEducationExpList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template
                v-if="index + 1 === form.hrResumeEducationExpList.length"
              >
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeEducationExpList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeEducationExpList.length)"
            ></div>
          </div>
        </van-cell-group>

        <!-- 工作经历 -->
        <div class="title">
          <div class="title-text">工作经历</div>
        </div>
        <van-cell-group inset>
          <van-checkbox
            class="no-work-checkbox"
            v-model="form.isFirstJob"
            @change="changeIsFirstJob($event)"
            shape="square"
          >
            没有工作经验
          </van-checkbox>
          <div v-for="(item, index) in form.hrResumeJobExpList" :key="index">
            <!-- 公司名称 -->
            <van-field
              v-model="item.companyName"
              label="公司名称"
              placeholder="请填写公司名称"
            />
            <!-- 职位名称 -->
            <van-field
              v-model="item.position"
              label="职位名称"
              placeholder="请填写职位名称"
            />
            <!-- 开始时间 -->
            <van-field
              v-model="item.startMonth"
              is-link
              readonly
              label="开始时间"
              placeholder="请选择开始时间"
              @click="item.startPicker = true"
            />
            <van-popup v-model:show="item.startPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.startNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'startMonth',
                    'endMonth',
                    'startPicker'
                  )
                "
                @cancel="item.startPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 结束时间 -->
            <van-field
              v-model="item.endMonth"
              is-link
              readonly
              label="结束时间"
              placeholder="请选择开始时间"
              @click="item.stopPicker = true"
            />
            <van-popup v-model:show="item.stopPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.endNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'endMonth',
                    'startMonth',
                    'stopPicker'
                  )
                "
                @cancel="item.stopPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 描述 -->
            <van-field
              v-model="item.jobDescription"
              rows="3"
              label="描述"
              type="textarea"
              placeholder="请输入描述"
            />
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeJobExpList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template v-if="index + 1 === form.hrResumeJobExpList.length">
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeJobExpList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeJobExpList.length)"
            ></div>
          </div>
        </van-cell-group>

        <!-- 项目经历 -->
        <div class="title can-add">
          <div class="title-text">项目经历</div>
          <div
            v-if="form.hrResumeProjectExpList.length == 0"
            class="add-function"
            @click="addExperience('hrResumeProjectExpList')"
          >
            <van-icon name="plus" />
            添加
          </div>
        </div>
        <van-cell-group inset>
          <div
            v-for="(item, index) in form.hrResumeProjectExpList"
            :key="index"
          >
            <!-- 公司名称 -->
            <van-field
              v-model="item.projectName"
              label="项目名称"
              placeholder="请填写项目名称"
            />
            <!-- 职位名称 -->
            <van-field
              v-model="item.roleName"
              label="项目角色"
              placeholder="请填写项目角色"
            />
            <!-- 开始时间 -->
            <van-field
              v-model="item.projectStartMonth"
              is-link
              readonly
              label="开始时间"
              placeholder="请选择开始时间"
              @click="item.startPicker = true"
            />
            <van-popup v-model:show="item.startPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.startNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'projectStartMonth',
                    'projectEndMonth',
                    'startPicker'
                  )
                "
                @cancel="item.startPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 结束时间 -->
            <van-field
              v-model="item.projectEndMonth"
              is-link
              readonly
              label="结束时间"
              placeholder="请选择开始时间"
              @click="item.stopPicker = true"
            />
            <van-popup v-model:show="item.stopPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.endNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'projectEndMonth',
                    'projectStartMonth',
                    'stopPicker'
                  )
                "
                @cancel="item.stopPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 描述 -->
            <van-field
              v-model="item.projectDescription"
              rows="3"
              label="描述"
              type="textarea"
              placeholder="请输入描述"
            />
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeProjectExpList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template v-if="index + 1 === form.hrResumeProjectExpList.length">
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeProjectExpList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeProjectExpList.length)"
            ></div>
          </div>
        </van-cell-group>

        <!-- 语言能力 -->
        <div class="title can-add">
          <div class="title-text">语言能力</div>
          <div
            v-if="form.hrResumeLanguageDegreeList.length == 0"
            class="add-function"
            @click="addExperience('hrResumeLanguageDegreeList')"
          >
            <van-icon name="plus" />
            添加
          </div>
        </div>
        <van-cell-group inset>
          <div
            v-for="(item, index) in form.hrResumeLanguageDegreeList"
            :key="index"
          >
            <!-- 语言 -->
            <van-field
              v-model="item.languageName"
              label="语言"
              placeholder="请填写语言"
            />
            <!-- 掌握程度 -->
            <van-field
              v-model="item.languageDegree"
              is-link
              readonly
              label="掌握程度"
              placeholder="请选择掌握程度"
              @click="item.picker = true"
            />
            <van-popup v-model:show="item.picker" position="bottom">
              <van-picker
                :columns="languageDegreeList"
                @confirm="languageDegreeConfirm($event, index)"
                @cancel="item.picker = false"
              />
            </van-popup>
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeLanguageDegreeList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template
                v-if="index + 1 === form.hrResumeLanguageDegreeList.length"
              >
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeLanguageDegreeList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeLanguageDegreeList.length)"
            ></div>
          </div>
        </van-cell-group>

        <!-- 工作技能 -->
        <div class="title can-add">
          <div class="title-text">工作技能</div>
          <div
            v-if="form.hrResumeJobSkillList.length == 0"
            class="add-function"
            @click="addExperience('hrResumeJobSkillList')"
          >
            <van-icon name="plus" />
            添加
          </div>
        </div>
        <van-cell-group inset>
          <div v-for="(item, index) in form.hrResumeJobSkillList" :key="index">
            <!-- 技能名称 -->
            <van-field
              v-model="item.skillName"
              label="技能名称"
              placeholder="请填写技能名称"
            />
            <!-- 掌握程度 -->
            <van-field
              v-model="item.skillDegree"
              is-link
              readonly
              label="掌握程度"
              placeholder="请选择掌握程度"
              @click="item.picker = true"
            />
            <van-popup v-model:show="item.picker" position="bottom">
              <van-picker
                :columns="languageDegreeList"
                @confirm="skillDegreeConfirm($event, index)"
                @cancel="item.picker = false"
              />
            </van-popup>
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeJobSkillList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template v-if="index + 1 === form.hrResumeJobSkillList.length">
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeJobSkillList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeJobSkillList.length)"
            ></div>
          </div>
        </van-cell-group>

        <!-- 证书 -->
        <div class="title can-add">
          <div class="title-text">证书</div>
          <div
            v-if="form.hrResumeCredentialList.length == 0"
            class="add-function"
            @click="addExperience('hrResumeCredentialList')"
          >
            <van-icon name="plus" />
            添加
          </div>
        </div>
        <van-cell-group inset>
          <div
            v-for="(item, index) in form.hrResumeCredentialList"
            :key="index"
          >
            <!-- 证书名称 -->
            <van-field
              v-model="item.credentialName"
              label="证书名称"
              placeholder="请填写证书名称"
            />
            <!-- 获得时间 -->
            <van-field
              v-model="item.acquireTime"
              is-link
              readonly
              label="获得时间"
              placeholder="请选择获得时间"
              @click="item.startPicker = true"
            />
            <van-popup v-model:show="item.startPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.startNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'acquireTime',
                    'empty',
                    'startPicker'
                  )
                "
                @cancel="item.startPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeCredentialList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template v-if="index + 1 === form.hrResumeCredentialList.length">
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeCredentialList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeCredentialList.length)"
            ></div>
          </div>
        </van-cell-group>

        <!-- 培训经历 -->
        <div class="title can-add">
          <div class="title-text">培训经历</div>
          <div
            v-if="form.hrResumeTrainingList.length == 0"
            class="add-function"
            @click="addExperience('hrResumeTrainingList')"
          >
            <van-icon name="plus" />
            添加
          </div>
        </div>
        <van-cell-group inset>
          <div v-for="(item, index) in form.hrResumeTrainingList" :key="index">
            <!-- 培训机构 -->
            <van-field
              v-model="item.trainingName"
              label="培训机构"
              placeholder="请填写培训机构"
            />
            <!-- 培训课程 -->
            <van-field
              v-model="item.trainingMajor"
              label="培训课程"
              placeholder="请填写培训课程"
            />
            <!-- 开始时间 -->
            <van-field
              v-model="item.trainingStartMonth"
              is-link
              readonly
              label="开始时间"
              placeholder="请选择开始时间"
              @click="item.startPicker = true"
            />
            <van-popup v-model:show="item.startPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.startNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'trainingStartMonth',
                    'trainingEndMonth',
                    'startPicker'
                  )
                "
                @cancel="item.startPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 结束时间 -->
            <van-field
              v-model="item.trainingEndMonth"
              is-link
              readonly
              label="结束时间"
              placeholder="请选择开始时间"
              @click="item.stopPicker = true"
            />
            <van-popup v-model:show="item.stopPicker" position="bottom">
              <van-datetime-picker
                type="date"
                v-model="item.endNowDate"
                @confirm="
                  chooseDateConfirm(
                    $event,
                    item,
                    'trainingEndMonth',
                    'trainingStartMonth',
                    'stopPicker'
                  )
                "
                @cancel="item.stopPicker = false"
                :min-date="minDate"
              />
            </van-popup>
            <!-- 描述 -->
            <van-field
              v-model="item.trainingDescribe"
              rows="3"
              label="描述"
              type="textarea"
              placeholder="请输入描述"
            />
            <!-- 按钮 -->
            <div class="buttom-function">
              <div
                class="buttom-function-delete"
                @click="deleteExperience('hrResumeTrainingList', index)"
              >
                <van-icon class="icon" name="delete-o" />
                删除
              </div>
              <template v-if="index + 1 === form.hrResumeTrainingList.length">
                <div>|</div>
                <div
                  class="buttom-function-add"
                  @click="addExperience('hrResumeTrainingList')"
                >
                  <van-icon class="icon" name="plus" />
                  继续添加
                </div>
              </template>
            </div>
            <!-- 多个项目中的分隔 空盒子 -->
            <div
              class="empty-div"
              v-if="!(index + 1 === form.hrResumeTrainingList.length)"
            ></div>
          </div>
        </van-cell-group>

        <van-sticky position="bottom" :offset-bottom="0.5">
          <div class="submit-btn">
            <van-button
              block
              type="primary"
              native-type="submit"
              :loading="submitLoading"
              loading-text="提交中..."
            >
              提交
            </van-button>
          </div>
        </van-sticky>
      </van-form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  NavBar,
  Form,
  Field,
  CellGroup,
  Button,
  Uploader,
  Icon,
  Picker,
  Popup,
  DatetimePicker,
  Checkbox,
  CheckboxGroup,
  Sticky,
  Toast,
} from "vant";
import { importFile, addCandidate } from "@/api/api";
export default {
  name: "sendResume",
  components: {
    [NavBar.name]: NavBar,
    [Form.name]: Form,
    [Field.name]: Field,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Uploader.name]: Uploader,
    [Icon.name]: Icon,
    [Picker.name]: Picker,
    [Popup.name]: Popup,
    [DatetimePicker.name]: DatetimePicker,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    [Sticky.name]: Sticky,
    [Toast.name]: Toast,
  },
  setup() {
    // 点击左侧返回 回到进入之前的页面
    const router = useRouter();
    const onClickLeft = () => {
      router.go(-1);
    };

    // 表单数据绑定
    const state = reactive({
      form: {
        name: "", //姓名
        phone: "", //手机号码
        email: "", //邮箱
        sex: "", //性别
        expectCity: "", //期望城市
        politicsStatus: "", //政治面貌
        birthDate: "", //出生年月
        salaryMin: "", //期望薪资 绑定最小薪资提交的时候再塞入最大薪资
        salaryUnit: "", //薪资单位
        salaryType: true, //是否面议
        hrResumeEducationExpList: [], //教育经历
        isFirstJob: true, //没有工作经验
        hrResumeJobExpList: [], //工作经历
        hrResumeProjectExpList: [], //项目经历
        hrResumeLanguageDegreeList: [], //语言能力
        hrResumeJobSkillList: [], //工作技能
        hrResumeCredentialList: [], //证书
        hrResumeTrainingList: [], //培训经历
      },
    });
    // 手机号正则
    const phonePattern = /^1[3456789]\d{9}$/;

    // 文件上传
    const fileList = ref([]);
    const afterRead = (file) => {
      file.status = "uploading";
      file.message = "上传中...";
      let formData = new FormData();
      formData.append("files", file.file);
      // formData.append("name", file.file.name);

      importFile(formData)
        .then((res) => {
          if (res.success) {
            file.status = "done";
            // 处理数据
            if (
              res.result.hrResumeJobExpList &&
              res.result.hrResumeJobExpList.length > 0
            ) {
              state.form.isFirstJob = false;
            }
            state.form = { ...state.form, ...res.result };
          } else {
            file.status = "failed";
            file.message = "上传失败";
          }
          Toast({
            message: res.message,
            position: "top",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    };

    //性别下拉选择
    const sexPicker = ref(false);
    const columns = ["男", "女"];
    const sexConfirm = (value) => {
      state.form.sex = value;
      sexPicker.value = false;
    };

    //日期下拉选择绑定的数据 默认为当天日期
    const nowDate = ref(new Date());
    // 出生年月下拉选择
    const birthDatePicker = ref(false);
    const birthDateConfirm = (value) => {
      console.log(value.getFullYear(), "年");
      console.log(value.getMonth() + 1, "月");
      console.log(value.getDate(), "日");
      state.form.birthDate =
        value.getFullYear() +
        "-" +
        (value.getMonth() + 1) +
        "-" +
        value.getDate();
      birthDatePicker.value = false;
    };

    //薪资单位下拉选项
    const salaryUnitPicker = ref(false);
    const salaryUnitList = ["元/月", "万/年"];
    const salaryUnitConfirm = (value) => {
      state.form.salaryUnit = value;
      salaryUnitPicker.value = false;
    };

    // 是否面议 复选框状态改变
    const salaryTypeChange = (value) => {
      if (value) {
        // 选择面议 清空期望薪资、薪资单位 禁用薪资输入框
        state.form.salaryMin = "";
        state.form.salaryUnit = "";
      } else {
        // 取消面议 取消禁用薪资输入框 赋初始值给薪资单位
        state.form.salaryUnit = "元/月";
      }
    };

    // 学历下拉框
    const educationLevelList = [
      "博士",
      "硕士",
      "本科",
      "大专",
      "高中",
      "专职",
      "初中",
      "小学",
      "其他",
    ];
    const educationLevelConfirm = (value, item) => {
      item.educationLevel = value;
      item.educationLevelPicker = false;
    };

    // 起止时间下拉框
    /**
     * value 选中的还回值
     * item 点击的当前项
     * formKey 当前项要设置的属性
     * anotherKey 当前项另一项的属性 开始时间/结束时间——检验时间由后往前
     * controlKey 当前项控制当前弹层的属性
     */
    const chooseDateConfirm = (
      value,
      item,
      formKey,
      anotherKey,
      controlKey
    ) => {
      // 如果当前项的另一项有值
      if (item[anotherKey]) {
        // 判断当前选的是开始时间还是结束时间
        if (controlKey === "startPicker") {
          // 如果是开始时间 则需要小于另一项的值
          if (!(value.getTime() < new Date(item[anotherKey]).getTime())) {
            // 不符合逻辑 return 并提示
            return Toast("开始时间不能大于结束时间");
          }
        } else {
          // 如果是结束时间 则需要大于另一项的值
          if (!(value.getTime() > new Date(item[anotherKey]).getTime())) {
            // 不符合逻辑 return 并提示
            return Toast("结束时间不能小于开始时间");
          }
        }
      }
      // 满足逻辑 处理数据
      item[formKey] =
        value.getFullYear() +
        "-" +
        (value.getMonth() + 1) +
        "-" +
        value.getDate();
      item[controlKey] = false;
    };

    // 没有工作经历 改变状态
    const changeIsFirstJob = (value) => {
      if (value) {
        state.form.hrResumeJobExpList = [];
      } else {
        if (state.form.hrResumeJobExpList.length == 0) {
          state.form.hrResumeJobExpList.push({
            startNowDate: new Date(),
            endNowDate: new Date(),
          });
        }
      }
    };

    // 根据传递的参数 增加或删除 经历
    const addExperience = (item) => {
      state.form[item].push({
        startNowDate: new Date(),
        endNowDate: new Date(),
      });
    };
    const deleteExperience = (item, index) => {
      state.form[item].splice(index, 1);
      if (item === "hrResumeJobExpList" && index == 0) {
        //如果是删除工作经历&&最后一条数据 需要勾选没有工作经验复选框
        state.form.isFirstJob = true;
      }
    };

    // 语言能力 掌握程度 下拉弹层数据
    const languageDegreeList = ["一般", "良好", "熟练", "精通"];
    const languageDegreeConfirm = (value, index) => {
      console.log("值", value, "索引", index);
    };
    // 工作技能 掌握程度 下拉弹层确定
    const skillDegreeConfirm = (value, index) => {
      console.log("值", value, "索引", index);
    };

    onMounted(() => {
      const route = useRoute();
      state.form.hrRecruitJobId = route.query.jobId;
    });
    // 点击提交
    const submitLoading = ref(false);
    const onSubmit = (values) => {
      submitLoading.value = true;
      let formData = JSON.parse(JSON.stringify(state.form));
      formData.isFirstJob = formData.isFirstJob ? "1" : "0";
      formData.salaryType = formData.salaryType ? "面议" : "普通";
      addCandidate(formData)
        .then((res) => {
          console.log(res);
          Toast(res.message);
        })
        .catch()
        .finally(() => {
          submitLoading.value = false;
        });
    };

    return {
      onClickLeft,
      onSubmit,
      ...toRefs(state),
      columns, //性别数组
      sexConfirm, //性别下拉弹出层确定
      sexPicker, //控制性别下拉弹层显示隐藏
      birthDateConfirm, //出生日期下拉弹出层确定
      birthDatePicker, ///出生日期下拉弹出层显示隐藏
      nowDate, //当前时间
      minDate: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      maxDate: new Date(),
      salaryUnitList, //薪资单位数据数组
      salaryUnitConfirm, //薪资单位下拉弹出层确定
      salaryUnitPicker, //控制薪资单位下拉弹层显示隐藏
      salaryTypeChange, //是否面议 状态改变
      addExperience, //增加各种经历
      deleteExperience, //删除各种经历
      educationLevelList, //学历选项数组
      educationLevelConfirm, //学历下拉弹出层确定
      chooseDateConfirm, //起止时间下拉弹出层确定
      changeIsFirstJob, //没有工作经历 状态改变
      languageDegreeList, //语言能力 掌握程度 数据数组
      languageDegreeConfirm, //语言能力 掌握程度 下拉弹出层确定
      skillDegreeConfirm, //工作技能 掌握程度 下拉弹出层确定
      afterRead, //
      fileList,
      phonePattern,
      submitLoading,
    };
  },
};
</script>

<style lang="less" scoped>
// 分类标题  附件简历/基本信息...
.title {
  padding: 12px 18px;
  background-color: #f3f5f7;
  .title-text {
    padding-left: 8px;
    font-family: "SimHei";
    font-weight: 600;
    border-left: 2px solid #1989fa;
  }
}
// 上传样式
/deep/.van-uploader {
  padding: 24px 18px;
  box-sizing: border-box;
  width: 100%;
  .van-uploader__input-wrapper,
  .van-uploader__wrapper {
    flex: 1;
    border: 1px dashed #e9e9e9;
  }
  .van-uploader__wrapper {
    display: block;
    .van-uploader__preview {
      margin: 12px;
      .van-uploader__file {
        width: 100%;
        height: 98px;
      }
    }
  }
  .up-load-icon {
    display: flex;
    justify-content: center;
    margin-top: 12px;
    font-size: 40px;
    color: #1989fa;
  }
  .up-load-middle,
  .up-load-bottom {
    text-align: center;
  }
  .up-load-middle {
    margin: 8px 0;
    color: #1989fa;
  }
  .up-load-bottom {
    margin-bottom: 12px;
  }
}
// 薪资右侧
.expectPosition-right {
  display: flex;
  .expectPosition-right-unit {
    margin-right: 8px;
  }
}
// 分类标题 可添加经历的添加样式
.can-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .add-function {
    color: #1989fa;
  }
}
// 底部 添加/删除 按钮样式
.buttom-function {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  .buttom-function-delete,
  .buttom-function-add {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      margin-right: 4px;
    }
  }
  .buttom-function-add {
    color: #1989fa;
  }
}
// 垫空盒子 分隔经历
.empty-div {
  height: 10px;
  background-color: #f3f5f7;
}
// 没有工作经验复选框
.no-work-checkbox {
  padding: 10px 18px;
}
// 底部提交按钮
.submit-btn {
  padding: 16px;
  border: 1px solid #fff;
  background-color: #fff;
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>>
