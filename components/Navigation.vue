<template>
  <nav class="bg-white shadow-sm border-r border-gray-200 h-full">
    <div class="p-4">
      <!-- 로고 -->
      <div class="flex items-center space-x-3 mb-8">
        <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Icon name="dashboard" size="md" class="text-white" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-900">Shop</h1>
          <p class="text-xs text-gray-500">BackOffice</p>
        </div>
      </div>

      <!-- 메뉴 -->
      <ul class="space-y-2">
        <!-- 대시보드 -->
        <li>
          <NuxtLink
              to="/"
              class="nav-link"
              :class="{ 'nav-link-active': $route.path === '/' }"
          >
            <Icon name="dashboard" size="sm" />
            <span>대시보드</span>
          </NuxtLink>
        </li>

        <!-- 브랜드 관리 (운영자 이상) -->
        <li v-if="authStore.isModerator">
          <div class="nav-section-title">브랜드 관리</div>
          <ul class="space-y-1 ml-4">
            <li>
              <NuxtLink
                  to="/shops"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/shops') }"
              >
                <Icon name="products" size="sm" />
                <span>브랜드 목록</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                  to="/products"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/products') }"
              >
                <Icon name="orders" size="sm" />
                <span>상품 관리</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                  to="/reviews"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/reviews') }"
              >
                <Icon name="comment" size="sm" />
                <span>리뷰 관리</span>
                <Badge
                    v-if="reviewsStore && reviewsStore.stats.pendingReviews > 0"
                    :text="reviewsStore.stats.pendingReviews.toString()"
                    variant="warning"
                    size="sm"
                    class="ml-auto"
                />
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- 게시판 관리 -->
        <li>
          <div class="nav-section-title">게시판</div>
          <ul class="space-y-1 ml-4">
            <li>
              <NuxtLink
                  to="/boards"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/boards') }"
              >
                <Icon name="post" size="sm" />
                <span>게시글 관리</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- 사용자 관리 (관리자만) -->
        <li v-if="authStore.isAdmin">
          <div class="nav-section-title">사용자</div>
          <ul class="space-y-1 ml-4">
            <li>
              <NuxtLink
                  to="/users"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/users') }"
              >
                <Icon name="users" size="sm" />
                <span>사용자 관리</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- 분석 (운영자 이상) -->
        <li v-if="authStore.isModerator">
          <div class="nav-section-title">분석</div>
          <ul class="space-y-1 ml-4">
            <li>
              <NuxtLink
                  to="/analytics"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/analytics') }"
              >
                <Icon name="analytics" size="sm" />
                <span>통계 분석</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- 설정 -->
        <li>
          <div class="nav-section-title">설정</div>
          <ul class="space-y-1 ml-4">
            <li>
              <NuxtLink
                  to="/profile"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/profile') }"
              >
                <Icon name="users" size="sm" />
                <span>개인정보</span>
              </NuxtLink>
            </li>
            <li v-if="authStore.isAdmin">
              <NuxtLink
                  to="/admin/settings"
                  class="nav-link"
                  :class="{ 'nav-link-active': $route.path.startsWith('/admin') }"
              >
                <Icon name="settings" size="sm" />
                <span>시스템 설정</span>
              </NuxtLink>
            </li>
            <li>
              <button
                  @click="handleLogout"
                  class="nav-link w-full text-left text-red-600 hover:bg-red-50"
              >
                <Icon name="close" size="sm" />
                <span>로그아웃</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-- 사용자 정보 -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {{ getUserInitials() }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ authStore.user?.fullName || '사용자' }}
          </p>
          <p class="text-xs text-gray-500">
            {{ getRoleDisplayName() }}
          </p>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// 리뷰 스토어는 옵션으로 가져오기 (없을 수도 있음)
let reviewsStore = null
try {
  reviewsStore = useReviewsStore()
} catch (error) {
  // 리뷰 스토어가 없는 경우 무시
}

// 사용자 이니셜 생성
const getUserInitials = () => {
  const user = authStore.user
  if (!user || !user.fullName) return '?'

  return user.fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
}

// 역할 표시
const getRoleDisplayName = () => {
  const role = authStore.user?.role
  switch (role) {
    case 'ADMIN':
      return '관리자'
    case 'SYSOP':
      return '운영자'
    case 'USER':
    default:
      return '일반 사용자'
  }
}

// 로그아웃 처리
const handleLogout = async () => {
  if (confirm('로그아웃하시겠습니까?')) {
    try {
      await authStore.logout()
      await router.push('/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }
}
</script>

<style scoped>
.nav-link {
  @apply flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors;
  @apply text-gray-700 hover:bg-gray-100 hover:text-gray-900;
}

.nav-link-active {
  @apply bg-primary-50 text-primary-700 border-r-2 border-primary-500;
}

.nav-section-title {
  @apply text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2 mt-6 mb-2;
}

.nav-section-title:first-child {
  @apply mt-0;
}
</style>