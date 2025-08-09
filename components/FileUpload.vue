<template>
  <div class="w-full">
    <div
        @drop.prevent="handleDrop"
        @dragover.prevent
        @dragenter.prevent
        class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        :class="{ 'border-blue-400 bg-blue-50': isDragging }"
    >
      <input
          ref="fileInput"
          type="file"
          :multiple="multiple"
          :accept="accept"
          @change="handleFileSelect"
          class="hidden"
      />

      <div v-if="!fileStore.uploading">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <div class="mt-4">
          <button
              @click="$refs.fileInput.click()"
              class="text-blue-600 hover:text-blue-500 font-medium"
          >
            파일 선택
          </button>
          <span class="text-gray-500"> 또는 드래그하여 업로드</span>
        </div>

        <p class="text-xs text-gray-500 mt-2">
          {{ acceptText }}
        </p>
      </div>

      <div v-else class="space-y-3">
        <div class="text-sm text-gray-600">업로드 중...</div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${fileStore.uploadProgress}%` }"
          ></div>
        </div>
        <div class="text-xs text-gray-500">{{ fileStore.uploadProgress }}%</div>
      </div>
    </div>

    <!-- 업로드된 파일 목록 -->
    <div v-if="uploadedFiles.length > 0" class="mt-4 space-y-2">
      <div
          v-for="file in uploadedFiles"
          :key="file.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <img
              v-if="file.type.startsWith('image/')"
              :src="file.url"
              :alt="file.name"
              class="w-10 h-10 object-cover rounded"
          />
          <div
              v-else
              class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>

          <div>
            <div class="text-sm font-medium text-gray-900">{{ file.name }}</div>
            <div class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</div>
          </div>
        </div>

        <button
            @click="removeFile(file)"
            class="text-red-500 hover:text-red-700 text-sm"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  multiple: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '*/*'
  },
  acceptText: {
    type: String,
    default: '모든 파일 형식'
  },
  folder: {
    type: String,
    default: 'general'
  }
})

const emit = defineEmits(['uploaded', 'removed'])

const fileStore = useFileStore()

const isDragging = ref(false)
const uploadedFiles = ref([])

const handleDrop = (e) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer.files)
  uploadFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  uploadFiles(files)
}

const uploadFiles = async (files) => {
  for (const file of files) {
    try {
      const result = await fileStore.uploadFile(file, props.folder)
      uploadedFiles.value.push(result)
      emit('uploaded', result)
    } catch (error) {
      console.error('파일 업로드 실패:', error)
    }
  }
}

const removeFile = async (file) => {
  try {
    await fileStore.deleteFile(file.id)
    uploadedFiles.value = uploadedFiles.value.filter(f => f.id !== file.id)
    emit('removed', file)
  } catch (error) {
    console.error('파일 삭제 실패:', error)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>