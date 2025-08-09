<template>
  <Teleport to="body">
    <div
        v-if="show"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
        @click="closeOnOutside && $emit('close')"
    >
      <div
          class="relative top-20 mx-auto p-5 border shadow-lg rounded-md bg-white"
          :class="sizeClasses"
          @click.stop
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
          <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <slot />
        </div>

        <div class="flex justify-end space-x-2">
          <slot name="footer">
            <button
                @click="$emit('close')"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              취소
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'md'
  },
  closeOnOutside: {
    type: Boolean,
    default: true
  }
})

defineEmits(['close'])

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'w-96',
    md: 'w-full max-w-md',
    lg: 'w-full max-w-2xl',
    xl: 'w-full max-w-4xl'
  }
  return sizes[props.size] || sizes.md
})
</script>