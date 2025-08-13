<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 모바일 오버레이 -->
    <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
        @click="sidebarOpen = false"
    ></div>

    <!-- 사이드바 -->
    <div
        :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0'
      ]"
    >
      <!-- 로고 영역 -->
      <div class="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 border-b border-gray-200">
        <h1 class="text-xl font-bold text-white">🏪 베리웹</h1>

        <!-- 모바일 닫기 버튼 -->
        <button
            @click="sidebarOpen = false"
            class="lg:hidden p-2 rounded-md text-white hover:bg-white hover:bg-opacity-20 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 네비게이션 -->
      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
              @click="closeSidebarOnMobile"
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
              @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path.startsWith('/shops') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            브랜드 관리
          </NuxtLink>

          <NuxtLink
              to="/boards"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path.startsWith('/boards')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
              @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path.startsWith('/boards') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            게시판 관리
          </NuxtLink>

          <NuxtLink
              to="/products"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path.startsWith('/products')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
              @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path.startsWith('/products') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            상품 관리
          </NuxtLink>

          <NuxtLink
              to="/reviews"
              class="flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.path.startsWith('/reviews')
                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'"
              @click="closeSidebarOnMobile"
          >
            <svg class="w-5 h-5 mr-3" :class="$route.path.startsWith('/reviews') ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            리뷰 관리
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
      <div class="p-4 bg-gray-50 border-t border-gray-200">
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
    <div :class="['transition-all duration-300 ease-in-out', sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64']">
      <!-- 상단 헤더 -->
      <header class="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 shadow-sm">
        <div class="flex items-center justify-between">
          <!-- 왼쪽: 햄버거 메뉴 + 페이지 제목 -->
          <div class="flex items-center space-x-4">
            <!-- 햄버거 메뉴 버튼 -->
            <button
                @click="toggleSidebar"
                class="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h2 class="text-xl lg:text-2xl font-bold text-gray-900">
                {{ pageTitle }}
              </h2>
              <p class="text-sm text-gray-600 mt-1 hidden sm:block">{{ pageDescription }}</p>
            </div>
          </div>

          <!-- 오른쪽: 액션 버튼들 -->
          <div class="flex items-center space-x-4">
            <!-- 알림 버튼 -->
            <button class="relative p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            <!-- 검색 버튼 -->
            <button class="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <!-- 현재 시간 (데스크톱에서만 표시) -->
            <div class="text-sm text-gray-500 hidden lg:block">
              {{ currentTime }}
            </div>
          </div>
        </div>
      </header>

      <!-- 메인 컨텐츠 -->
      <main class="p-4 lg:p-8 min-h-screen bg-gray-50">
        <slot />
      </main>

      <!-- 푸터 -->
      <footer class="bg-white border-t border-gray-200 px-4 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between">
          <div class="text-sm text-gray-500">
            © 2024 베리웹 백오피스. All rights reserved.
          </div>
          <div class="flex items-center space-x-6 text-sm text-gray-500 mt-4 sm:mt-0">
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
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '대시보드',
    '/shops': '브랜드 관리',
    '/boards': '게시판 관리',
    '/products': '상품 관리',
    '/reviews': '리뷰 관리'
  }

  // 동적 라우트 처리
  if (route.path.startsWith('/shops/') && route.path !== '/shops') {
    return '브랜드 상세 관리'
  }
  if (route.path.startsWith('/boards/') && route.path !== '/boards') {
    return '게시판 상세 관리'
  }
  if (route.path.startsWith('/products/') && route.path !== '/products') {
    return '상품 상세 관리'
  }
  if (route.path.startsWith('/reviews/') && route.path !== '/reviews') {
    return '리뷰 상세 관리'
  }

  return titles[route.path] || '관리자 페이지'
})

const pageDescription = computed(() => {
  const descriptions = {
    '/dashboard': '시스템 현황과 주요 지표를 확인하세요',
    '/shops': '등록된 브랜드들을 관리하고 모니터링하세요',
    '/boards': '게시판과 공지사항을 관리하세요',
    '/products': '등록된 상품들을 관리하고 모니터링하세요',
    '/reviews': '고객 리뷰를 관리하고 승인/거부 처리하세요'
  }

  if (route.path.startsWith('/shops/') && route.path !== '/shops') {
    return '브랜드의 상세 정보와 상품을 관리하세요'
  }
  if (route.path.startsWith('/boards/') && route.path !== '/boards') {
    return '게시판의 게시물과 댓글을 관리하세요'
  }
  if (route.path.startsWith('/products/') && route.path !== '/products') {
    return '상품의 상세 정보와 옵션을 관리하세요'
  }
  if (route.path.startsWith('/reviews/') && route.path !== '/reviews') {
    return '리뷰의 상세 정보와 답글을 관리하세요'
  }

  return descriptions[route.path] || '시스템을 효율적으로 관리하세요'
})

const userInitials = computed(() => {
  const name = authStore.user?.name || '관리자'
  return name.charAt(0).toUpperCase()
})

// 반응형 처리
const handleResize = () => {
  if (window.innerWidth >= 1024) { // lg 브레이크포인트
    sidebarOpen.value = false // 데스크톱에서는 오버레이 모드 비활성화
  }
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)

  // 윈도우 리사이즈 이벤트 리스너 추가
  window.addEventListener('resize', handleResize)

  // 초기 화면 크기 체크
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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

const toggleSidebar = () => {
  if (window.innerWidth < 1024) {
    // 모바일: 오버레이 모드 토글
    sidebarOpen.value = !sidebarOpen.value
  } else {
    // 데스크톱: 사이드바 접기/펼치기 (향후 확장 가능)
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth < 1024) {
    sidebarOpen.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
}

// ESC 키로 사이드바 닫기
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && sidebarOpen.value) {
      sidebarOpen.value = false
    }
  }

  document.addEventListener('keydown', handleEscape)

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

<style scoped>
/* 사이드바 스크롤바 스타일링 */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 2px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* 트랜지션 최적화 */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>