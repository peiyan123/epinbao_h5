<template>
  <div ref="viewerRef" id="markdownViewer" :class="$props.class"></div>
</template>

<script setup>
  import { defineProps, onBeforeUnmount, onDeactivated, ref, unref, watch } from 'vue'
  import VditorPreview from 'vditor/dist/method.min'
  import { onMountedOrActivated } from '@/hooks/onMountedOrActivated'
  import { stringTrim } from '@/utils'
  const props = defineProps({
    value: { type: String, default: '' },
    class: { type: String },
  })
  const viewerRef = ref(null)
  const vditorPreviewRef = ref(null)

  function init(value) {
    const viewerEl = unref(viewerRef)
    if (!viewerEl) return

    const content = stringTrim(value ?? props.value)
    if (!content) return

    vditorPreviewRef.value = VditorPreview.preview(viewerEl, content, {
      mode: 'light',
      theme: {
        current: 'light',
      },
      hljs: {
        style: 'github',
      },
    })
  }

  watch(
    () => props.value,
    (v, oldValue) => {
      if (v !== oldValue) {
        init(v)
      }
    },
    { immediate: true },
  )

  function destroy() {
    const vditorInstance = unref(vditorPreviewRef)
    if (!vditorInstance) return
    try {
      vditorInstance?.destroy?.()
    } catch (error) {}
    vditorPreviewRef.value = null
  }

  onMountedOrActivated(init)

  onBeforeUnmount(destroy)
  onDeactivated(destroy)
</script>
