<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          백오피스 로그인
        </h2>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
                v-model="form.email"
                type="email"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
                v-model="form.password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <button
              type="submit"
              :disabled="authStore.loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ authStore.loading ? '로그인 중...' : '로그인' }}
          </button>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">또는</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
            <button
                @click="handleGoogleLogin"
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              Google
            </button>

            <button
                @click="handleKakaoLogin"
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-yellow-300 text-sm font-medium text-gray-900 hover:bg-yellow-400"
            >
              Kakao
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const authStore = useAuthStore()
const config = useRuntimeConfig()

const form = reactive({
  usernameOrEmail: '',
  password: ''
})

const handleLogin = async () => {
  try {
    await authStore.login(form)
  } catch (error) {
    // 에러 처리 (토스트 메시지 등)
    console.error('로그인 실패:', error)
  }
}

const handleGoogleLogin = () => {
  const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${config.public.oauthGoogleClientId}&redirect_uri=${window.location.origin}/auth/google/callback&response_type=code&scope=email profile`
  window.location.href = googleAuthUrl
}

const handleKakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${config.public.oauthKakaoClientId}&redirect_uri=${window.location.origin}/auth/kakao/callback&response_type=code`
  window.location.href = kakaoAuthUrl
}
</script>