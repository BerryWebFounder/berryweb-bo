<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
        class="loading-spinner"
        :class="spinnerClass"
        :style="{ width: size + 'px', height: size + 'px' }"
    ></div>
    <span v-if="text" class="ml-2 text-gray-600">{{ text }}</span>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 32
  },
  text: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const containerClass = computed(() => {
  return props.overlay
      ? 'fixed inset-0 bg-white bg-opacity-75 z-50'
      : 'py-4'
})

const spinnerClass = computed(() => {
  const baseClass = 'border-2 border-gray-200'
  const sizeClass = props.size >= 48 ? 'border-4' : 'border-2'
  return `${baseClass} ${sizeClass}`
})
</script>