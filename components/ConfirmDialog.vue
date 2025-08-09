<template>
  <Modal v-model:show="show" :title="title" size="sm" :close-on-outside="false">
    <div class="space-y-4">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-gray-600">{{ message }}</p>
        </div>
      </div>
    </div>

    <template #footer>
      <button
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
      >
        {{ cancelText }}
      </button>
      <button
          @click="$emit('confirm')"
          class="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        {{ confirmText }}
      </button>
    </template>
  </Modal>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '확인'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: '확인'
  },
  cancelText: {
    type: String,
    default: '취소'
  }
})

defineEmits(['confirm', 'cancel'])
</script>