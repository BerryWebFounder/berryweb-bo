<template>
  <div
      v-if="show"
      class="rounded-md p-4"
      :class="typeClasses"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <component :is="icon" class="h-5 w-5" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium" :class="titleClass">
          {{ title }}
        </h3>
        <div class="mt-2 text-sm" :class="messageClass">
          <p>{{ message }}</p>
        </div>
        <div v-if="retry" class="mt-4">
          <button
              @click="$emit('retry')"
              class="text-sm font-medium hover:underline"
              :class="buttonClass"
          >
            다시 시도
          </button>
        </div>
      </div>
      <div v-if="dismissible" class="ml-auto pl-3">
        <button
            @click="$emit('dismiss')"
            class="inline-flex rounded-md p-1.5 hover:bg-opacity-20"
            :class="dismissClass"
        >
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info', 'success'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  retry: {
    type: Boolean,
    default: false
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

defineEmits(['retry', 'dismiss'])

const typeConfig = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    message: 'text-red-700',
    button: 'text-red-600',
    dismiss: 'text-red-500 hover:bg-red-500'
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-400',
    title: 'text-yellow-800',
    message: 'text-yellow-700',
    button: 'text-yellow-600',
    dismiss: 'text-yellow-500 hover:bg-yellow-500'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    message: 'text-blue-700',
    button: 'text-blue-600',
    dismiss: 'text-blue-500 hover:bg-blue-500'
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-400',
    title: 'text-green-800',
    message: 'text-green-700',
    button: 'text-green-600',
    dismiss: 'text-green-500 hover:bg-green-500'
  }
}

const config = computed(() => typeConfig[props.type])

const typeClasses = computed(() =>
    `${config.value.bg} ${config.value.border} border`
)

const titleClass = computed(() => config.value.title)
const messageClass = computed(() => config.value.message)
const buttonClass = computed(() => config.value.button)
const dismissClass = computed(() => config.value.dismiss)

const icon = computed(() => {
  const icons = {
    error: 'ExclamationCircleIcon',
    warning: 'ExclamationTriangleIcon',
    info: 'InformationCircleIcon',
    success: 'CheckCircleIcon'
  }
  return icons[props.type]
})
</script>