<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div v-if="loading" class="space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
        <p class="text-gray-600">Kakao 로그인 처리 중...</p>
      </div>

      <div v-else-if="error" class="space-y-4">
        <div class="text-red-600">
          <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-red-600">로그인에 실패했습니다.</p>
        <p class="text-gray-500 text-sm">{{ error }}</p>
        <NuxtLink
            to="/login"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-400 hover:bg-yellow-500 text-gray-900"
        >
          로그인 페이지로 돌아가기
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const code = route.query.code
    const error_param = route.query.error

    if (error_param) {
      throw new Error(`OAuth 에러: ${error_param}`)
    }

    if (!code) {
      throw new Error('인증 코드가 없습니다.')
    }

    await authStore.loginWithOAuth('kakao', code)
  } catch (err) {
    error.value = err.message
    console.error('Kakao OAuth 콜백 에러:', err)
  } finally {
    loading.value = false
  }
})
</script>