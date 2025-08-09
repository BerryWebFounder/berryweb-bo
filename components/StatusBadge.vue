<template>
  <span
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      :class="badgeClasses"
  >
    <svg
        v-if="showIcon"
        class="-ml-0.5 mr-1.5 h-2 w-2"
        :class="iconClasses"
        fill="currentColor"
        viewBox="0 0 8 8"
    >
      <circle cx="4" cy="4" r="3" />
    </svg>
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'default'
  },
  showIcon: {
    type: Boolean,
    default: true
  }
})

const statusConfig = {
  active: {
    label: '활성',
    classes: 'bg-green-100 text-green-800',
    iconClasses: 'text-green-400'
  },
  inactive: {
    label: '비활성',
    classes: 'bg-red-100 text-red-800',
    iconClasses: 'text-red-400'
  },
  pending: {
    label: '대기중',
    classes: 'bg-yellow-100 text-yellow-800',
    iconClasses: 'text-yellow-400'
  },
  draft: {
    label: '임시저장',
    classes: 'bg-gray-100 text-gray-800',
    iconClasses: 'text-gray-400'
  },
  published: {
    label: '게시됨',
    classes: 'bg-blue-100 text-blue-800',
    iconClasses: 'text-blue-400'
  }
}

const config = computed(() => statusConfig[props.status] || statusConfig.draft)
const label = computed(() => config.value.label)
const badgeClasses = computed(() => config.value.classes)
const iconClasses = computed(() => config.value.iconClasses)
</script>