<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- 사이드바 -->
    <div class="w-64 bg-white shadow-lg">
      <div class="p-6">
        <h1 class="text-2xl font-bold text-gray-800">백오피스</h1>
      </div>

      <nav class="mt-6">
        <div class="px-6 py-3">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            관리 메뉴
          </h3>
        </div>

        <div class="space-y-1">
          <NuxtLink
              to="/dashboard"
              class="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              active-class="bg-blue-50 text-blue-700"
          >
            대시보드
          </NuxtLink>

          <NuxtLink
              to="/shops"
              class="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              active-class="bg-blue-50 text-blue-700"
          >
            브랜드 관리
          </NuxtLink>

          <NuxtLink
              to="/boards"
              class="flex items-center px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
              active-class="bg-blue-50 text-blue-700"
          >
            게시판 관리
          </NuxtLink>
        </div>
      </nav>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="flex-1">
      <!-- 헤더 -->
      <header class="bg-white shadow">
        <div class="flex justify-between items-center px-6 py-4">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ pageTitle }}
          </h2>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              {{ authStore.user?.name }}님
            </span>
            <button
                @click="handleLogout"
                class="text-sm text-red-600 hover:text-red-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <!-- 페이지 컨텐츠 -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '대시보드',
    '/shops': '브랜드 관리',
    '/boards': '게시판 관리'
  }
  return titles[route.path] || '관리자 페이지'
})

const handleLogout = () => {
  authStore.logout()
}
</script>