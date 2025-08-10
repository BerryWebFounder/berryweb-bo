<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 사이드바 -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200">
      <!-- 로고 영역 -->
      <div class="flex items-center justify-center h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 border-b border-gray-200">
        <h1 class="text-xl font-bold text-white">🏪 베리웹</h1>
      </div>

      <!-- 네비게이션 -->
      <nav class="flex-1 px-4 py-6 space-y-2">
        <div class="mb-6">
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            메인 메뉴
          </p>

          <NuxtLink
              to="/dashboard"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path === '/dashboard'
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path === '/dashboard' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21l4-4 4 4" />
            </svg>
            대시보드
          </NuxtLink>

          <NuxtLink
              to="/shops"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path.startsWith('/shops')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path.startsWith('/shops') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            상점 관리
          </NuxtLink>

          <NuxtLink
              to="/boards"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path.startsWith('/boards')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path.startsWith('/boards') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            게시판 관리
          </NuxtLink>
        </div>

        <div class="mb-6">
          <p class="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            설정
          </p>

          <button class="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group">
            <svg class="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            시스템 설정
          </button>
        </div>
      </nav>

      <!-- 사용자 정보 -->
      <div class="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span class="text-sm font-medium text-white">{{ userInitials }}</span>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name || '관리자' }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.email || 'admin@example.com' }}</p>
          </div>
          <button
              @click="handleLogout"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="로그아웃"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 영역 -->
    <div class="ml-64">
      <!-- 상단 헤더 -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">
              {{ pageTitle }}
            </h2>
            <p class="text-sm text-gray-600 mt-1">{{ pageDescription }}</p>
          </div>

          <div class="flex items-center space-x-4">
            <!-- 알림 버튼 -->
            <button class="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5c-3 3-6.5-1-3-4l-2-1m-4-4H6l5-5c3-3 6.5 1 3 4l2 1M9 21H3l3-6 3 6zM21 3l-6 6h6V3z" />
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            <!-- 검색 버튼 -->
            <button class="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- 현재 시간 -->
            <div class="text-sm text-gray-500">
              {{ currentTime }}
            </div>
          </div>
        </div>
      </header>

      <!-- 메인 컨텐츠 -->
      <main class="p-8 min-h-screen bg-gray-50">
        <slot />
      </main>

      <!-- 푸터 -->
      <footer class="bg-white border-t border-gray-200 px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            © 2024 베리웹 백오피스. All rights reserved.
          </div>
          <div class="flex items-center space-x-6 text-sm text-gray-500">
            <a href="#" class="hover:text-gray-700 transition-colors">도움말</a>
            <a href="#" class="hover:text-gray-700 transition-colors">개인정보처리방침</a>
            <a href="#" class="hover:text-gray-700 transition-colors">서비스 약관</a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()

const currentTime = ref('')

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '대시보드',
    '/shops': '상점 관리',
    '/boards': '게시판 관리'
  }

  // 동적 라우트 처리
  if (route.path.startsWith('/shops/') && route.path !== '/shops') {
    return '상점 상세 관리'
  }
  if (route.path.startsWith('/boards/') && route.path !== '/boards') {
    return '게시판 상세 관리'
  }

  return titles[route.path] || '관리자 페이지'
})

const pageDescription = computed(() => {
  const descriptions = {
    '/dashboard': '시스템 현황과 주요 지표를 확인하세요',
    '/shops': '등록된 상점들을 관리하고 모니터링하세요',
    '/boards': '게시판과 공지사항을 관리하세요'
  }

  if (route.path.startsWith('/shops/') && route.path !== '/shops') {
    return '상점의 상세 정보와 상품을 관리하세요'
  }
  if (route.path.startsWith('/boards/') && route.path !== '/boards') {
    return '게시판의 게시물과 댓글을 관리하세요'
  }

  return descriptions[route.path] || '시스템을 효율적으로 관리하세요'
})

const userInitials = computed(() => {
  const name = authStore.user?.name || '관리자'
  return name.charAt(0).toUpperCase()
})

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = () => {
  authStore.logout()
}
</script>