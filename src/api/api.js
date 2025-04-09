import request, { instance } from '@/utils/request'

const prefix = process.env.NODE_ENV === 'development' ? '' : ''

// 获取短信验证码
export function sendSms(params) {
  // return request(prefix + '/epinbao-wechat/wechat/user/sendSms', 'POST', params)
  return request(prefix + '/manage/lb/lbApplyForProbation/LbSendSms', 'POST', params)
}

// 注册短信验证码
export function sendRegisterSms(params) {
  return request(prefix + '/manage/lb/lbApplyForProbation/sendSms', 'POST', params)
}

// 个人租戶登录-短信登录
export function smsLogin(params) {
  // return request(prefix + '/epinbao-wechat/wechat/user/smsLogin', 'POST', params)
  return request(prefix + '/manage/lb/lbApplyForProbation/smsLogin', 'POST', params)
}

// 注册
export function smsRegister(params) {
  return request(prefix + '/manage/lb/lbApplyForProbation/checkSms', 'POST', params)
}

// 微信公众号-职位分类列表
export function queryWxJobCategoryList(params) {
  return request('/epinbao-wechat/wechat/hrWxJob/queryWxJobCategoryList', 'GET', params)
}

// 微信公众号-职位列表
export function queryWxJobList(params) {
  return request(prefix + '/user/normal/recruit/job/list', 'GET', params)
}

// 微信公众号-查询职位详情
export function queryWxJobDetailById(params) {
  return request(prefix + '/tenant/hrRecruitJob/queryById', 'GET', params)
}

export function getWxSign(params) {
  return request(prefix + '/open/wechat/get-jsapi-ticket', 'POST', params)
}

// 查看职位详情(分享链接进入)
export function queryJobDetailById(params) {
  return request(prefix + '/tenant/hrRecruitJob/invite/queryById', 'GET', params)
}

// 微信公众号简历解析
export function importFile(params) {
  return request('/epinbao-wechat/wechat/resume/importFile', 'POST', params)
}
export function uploadFile(params, onProgressUpload) {
  return instance({
    url: prefix + '/tenant/hrResumeRecommend/importFile',
    method: 'POST',
    data: params,
    onUploadProgress: onProgressUpload,
  })
}
// 解析简历 （分享入口）
export function uploadFileShare(params, onProgressUpload, inviteCode) {
  return instance({
    url: prefix + `/tenant/lbHrResume/invite/importFile/${inviteCode}`,
    method: 'POST',
    data: params,
    onUploadProgress: onProgressUpload,
  })
}
// 2.验证简历是否重复

export function verifyResume(params) {
  return request(prefix + '/tenant/hrResume/checkRepeatResume', 'POST', params)
}

// 求职者通过分享进来
export function verifyResumeHunter(params, invoteCode) {
  return request(prefix + `/hrResume/Api/invite/checkRepeatResume/${invoteCode}`, 'POST', params)
}
// 3.添加简历求职者
// export function addResumeHunter(params, inviteCode) {
//   return request(prefix + `/tenant/hrResume/invite/addHrResume/${inviteCode}`, 'POST', params)
// }

export function addResumeHunter(params, inviteCode) {
  return request(prefix + `/hrResume/Api/addCandidate/${inviteCode}`, 'POST', params)
}

// 添加简历HR
export function addResume(params) {
  return request(prefix + '/tenant/hrResume/batchAddHrResume', 'POST', params)
}

// 4.获取候选人id和简历ID
export function candidateIdAndResumeIdApi(params) {
  return request(prefix + '/tenant/hrResume/findHrCandidateId', 'GET', params)
}
// 5.推送候选人到职位
// 微信公众号投递职位
export function addCandidateHunter(params, inviteCode) {
  return request(
    prefix + `/tenant/recruit/hrTalent/invite/addCandidate/${inviteCode}`,
    'POST',
    params,
  )
}
// 推送简历到职位数组
export function addCandidate(params) {
  return request(prefix + '/tenant/recruit/hrTalent/addCandidate', 'POST', params)
}

// 人才库列表
export function hrTalentList(params) {
  return request(prefix + '/tenant/recruit/lbTalent/list', 'GET', params)
}
// 已投递列表
export function deliveredList(params) {
  return request(prefix + '/tenant/recruit/hrCandidate/queryEmployPageList', 'GET', params)
}
// 查询可推送的企业
export function getCanUseCompanys(params) {
  return request(prefix + '/tenant/hrRecruitJob/getCanUseCompanys', 'GET', params)
}
// 查询可推送的职位
export function getCanUseJobs(params) {
  return request(prefix + '/tenant/hrRecruitJob/getCanUseJobs', 'GET', params)
}

// 微信公众号用户投递实时记录
export function addCandidateList(params) {
  return request('/epinbao-wechat/wechat/resume/addCandidateList', 'POST', params)
}

// 招聘来源列表
export function resumeSourceListApi() {
  return request(prefix + '/tenant/recruit/hrRecruitChannel/queryList', 'GET', '')
}
