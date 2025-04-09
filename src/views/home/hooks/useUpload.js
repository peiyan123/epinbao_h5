import { ref, computed } from 'vue'
import { uploadFile, uploadFileShare } from '@/api/api'
import { useStore } from 'vuex'

export function useUpload({ recommendCode }) {
  const store = useStore()
  const fileList = ref([])
  const uploadProgress = ref(0)
  const uploadStatus = ref(0) // 0 未开始 1 上传中 2 上传完成 3 上传失败
  const isShare = computed(() => {
    return store.getters['user/isShare']
  })
  function afterRead(file) {
    const formData = new FormData()
    console.log(file.file)
    formData.append('files', file.file)
    formData.append('recommendCode', recommendCode)
    isShare.value ? uploadResumeShare(formData) : uploadResume(formData)
  }

  // 上传简历
  function uploadResume(formData) {
    uploadFile(formData, (progressEvent) => {
      uploadProgress.value = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
      console.log('uploadProgress.value', uploadProgress.value)
      uploadStatus.value = 1
    })
      .then((res) => {
        if (res.code === 200) {
          uploadStatus.value = 2
          store.commit('user/setUploadInfo', res.result)
        } else {
          uploadStatus.value = 3
        }
      })
      .catch(() => {
        uploadStatus.value = 3
      })
  }
  // 上传简历 (分享)
  function uploadResumeShare(formData) {
    uploadFileShare(
      formData,
      (progressEvent) => {
        uploadProgress.value = Math.floor((progressEvent.loaded / progressEvent.total) * 100)
        console.log('uploadProgress.value', uploadProgress.value)
        uploadStatus.value = 1
      },
      store.state.user.recommendCode,
    )
      .then((res) => {
        if (res.code === 200) {
          uploadStatus.value = 2
          store.commit('user/setUploadInfo', res.result)
        } else {
          uploadStatus.value = 3
        }
      })
      .catch(() => {
        uploadStatus.value = 3
      })
  }

  return {
    fileList,
    afterRead,
    uploadProgress,
    uploadStatus,
  }
}
