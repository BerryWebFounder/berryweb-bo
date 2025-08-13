<template>
  <AdminLayout>
    <div class="space-y-8">
      <!-- 헤더 섹션 -->
      <div class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl shadow-2xl">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="relative px-8 py-12">
          <div class="max-w-4xl">
            <h1 class="text-4xl font-bold text-white mb-4">
              관리자 대시보드
            </h1>
            <p class="text-xl text-blue-100 mb-6">
              실시간 시스템 현황과 주요 지표를 한눈에 확인하세요
            </p>
            <div class="flex items-center space-x-6 text-white/90">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span class="text-sm">시스템 정상 운영</span>
              </div>
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">{{ currentTime }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 장식적 요소 -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <!-- 통계 카드들 -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-500 mb-1">총 브랜드 수</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalShops.toLocaleString() }}</p>
                <p class="text-xs text-green-600 font-medium">+{{ stats.newShopsThisMonth }}개 이번 달</p>
              </div>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-500 mb-1">총 상품 수</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.totalProducts.toLocaleString() }}</p>
                <p class="text-xs text-green-600 font-medium">+{{ stats.newProductsThisWeek }}개 이번 주</p>
              </div>
            </div>
          </div>
        </div>

        <div class="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div class="relative p-6">
            <div class="flex items-center justify-between">
              <div class="flex-shrink-0">
                <div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-medium text-gray-500 mb-1">활성 사용자</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats.activeUsers.toLocaleString() }}</p>
                <p class="text-xs text-green-600 font-medium">+{{ stats.newUsersThisWeek }}명 이번 주</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 차트 섹션 -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- 브랜드 생성 추이 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              브랜드 생성 추이
            </h3>
            <p class="text-blue-100 text-sm mt-1">월별 신규 브랜드 등록 현황</p>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div v-for="(data, index) in shopTrendData" :key="index" class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span class="text-sm font-medium text-gray-700">{{ data.month }}</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-32 bg-gray-200 rounded-full h-2">
                    <div
                        class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                        :style="{ width: `${(data.shops / 30) * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-sm font-bold text-gray-900 w-8">{{ data.shops }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 상품 통계 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              상품 상태별 통계
            </h3>
            <p class="text-emerald-100 text-sm mt-1">상품 상태별 분포</p>
          </div>
          <div class="p-6">
            <div class="space-y-6">
              <div v-for="(data, index) in productStatsData" :key="index" class="relative">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-3">
                    <div
                        class="w-4 h-4 rounded-full"
                        :style="{ backgroundColor: productColors[index] }"
                    ></div>
                    <span class="text-sm font-medium text-gray-700">{{ data.name }}</span>
                  </div>
                  <span class="text-sm font-bold text-gray-900">{{ data.value }}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-3">
                  <div
                      class="h-3 rounded-full transition-all duration-1000 ease-out"
                      :style="{
                      width: `${data.value}%`,
                      backgroundColor: productColors[index]
                    }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 퀵 액션 및 최근 활동 -->
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <!-- 퀵 액션 -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              빠른 작업
            </h3>
          </div>
          <div class="p-6 space-y-4">
            <NuxtLink
                to="/shops"
                class="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-colors group"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="ml-4">
                <p class="font-medium text-gray-900">브랜드 관리</p>
                <p class="text-sm text-gray-500">브랜드를 생성하고 관리</p>
              </div>
            </NuxtLink>

            <button
                @click="refreshData"
                class="w-full flex items-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-colors group"
            >
              <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div class="ml-4 text-left">
                <p class="font-medium text-gray-900">데이터 새로고침</p>
                <p class="text-sm text-gray-500">최신 통계 업데이트</p>
              </div>
            </button>

            <button class="w-full flex items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors group">
              <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div class="ml-4 text-left">
                <p class="font-medium text-gray-900">데이터 분석</p>
                <p class="text-sm text-gray-500">상세 통계 보고서</p>
              </div>
            </button>
          </div>
        </div>

        <!-- 최근 활동 -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4">
            <h3 class="text-lg font-semibold text-white flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              최근 활동
            </h3>
            <p class="text-gray-300 text-sm mt-1">실시간 시스템 활동 내역</p>
          </div>
          <div class="p-6">
            <div v-if="loading" class="flex items-center justify-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              <span class="ml-2 text-gray-600">활동 내역을 불러오는 중...</span>
            </div>

            <div v-else class="flow-root max-h-80 overflow-y-auto">
              <ul class="-mb-8">
                <li v-for="(activity, index) in recentActivities" :key="activity.id">
                  <div class="relative pb-8" :class="{ 'pb-0': index === recentActivities.length - 1 }">
                    <span
                        v-if="index !== recentActivities.length - 1"
                        class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gradient-to-b from-gray-300 to-transparent"
                    ></span>

                    <div class="relative flex space-x-4">
                      <div>
                        <span
                            class="h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-lg"
                            :class="getActivityIconClass(activity.type)"
                        >
                          <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>

                      <div class="min-w-0 flex-1 pt-1.5">
                        <div class="flex justify-between items-start">
                          <div>
                            <p class="text-sm font-medium text-gray-900">
                              {{ activity.description }}
                            </p>
                            <p class="text-xs text-gray-500 mt-1">
                              {{ activity.details }}
                            </p>
                          </div>
                          <div class="text-right">
                            <p class="text-xs text-gray-500">
                              {{ formatRelativeTime(activity.createdAt) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const shopStore = useShopStore()
const toast = useToast()

const currentTime = ref('')
const loading = ref(false)

const stats = ref({
  totalShops: 0,
  totalProducts: 0,
  activeUsers: 0,
  newShopsThisMonth: 0,
  newProductsThisWeek: 0,
  newUsersThisWeek: 0
})

const recentActivities = ref([
  {
    id: 1,
    type: 'shop_created',
    description: '새로운 브랜드가 등록되었습니다',
    details: '"맛있는 베이커리" - 김영희님',
    createdAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    type: 'product_added',
    description: '신규 상품이 추가되었습니다',
    details: '프리미엄 크루아상 세트',
    createdAt: new Date(Date.now() - 15 * 60 * 1000)
  },
  {
    id: 3,
    type: 'user_registered',
    description: '신규 사용자가 가입했습니다',
    details: '이번 주 +24명',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'review_added',
    description: '새로운 리뷰가 작성되었습니다',
    details: '상품: 프리미엄 크루아상 세트 (★★★★★)',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
  }
])

// 차트 데이터
const shopTrendData = ref([
  { month: '1월', shops: 12 },
  { month: '2월', shops: 19 },
  { month: '3월', shops: 15 },
  { month: '4월', shops: 25 },
  { month: '5월', shops: 22 },
  { month: '6월', shops: 30 }
])

const productStatsData = ref([
  { name: '판매중', value: 65 },
  { name: '품절', value: 20 },
  { name: '판매중지', value: 15 }
])

const productColors = ['#10b981', '#f59e0b', '#ef4444']

onMounted(async () => {
  updateTime()
  setInterval(updateTime, 1000)
  await loadDashboardData()
})

const updateTime = () => {
  currentTime.value = new Date().toLocaleString('ko-KR')
}

const loadDashboardData = async () => {
  loading.value = true
  try {
    // 실제 API 엔드포인트가 있다면 사용, 없다면 기본값 사용
    await shopStore.fetchShops({ size: 1000 }) // 모든 브랜드 조회

    // 통계 계산
    const shops = shopStore.shops
    const totalShops = shops.length
    const activeShops = shops.filter(shop => shop.isActive).length
    const totalProducts = shops.reduce((sum, shop) => sum + (shop.productCount || 0), 0)

    // 이번 달 생성된 브랜드 계산
    const thisMonth = new Date().getMonth()
    const newShopsThisMonth = shops.filter(shop => {
      const createdMonth = new Date(shop.createdAt).getMonth()
      return createdMonth === thisMonth
    }).length

    stats.value = {
      totalShops,
      totalProducts,
      activeUsers: 342, // 실제 사용자 서비스에서 가져와야 함
      newShopsThisMonth,
      newProductsThisWeek: 18, // 실제 계산 필요
      newUsersThisWeek: 24 // 실제 사용자 서비스에서 가져와야 함
    }

    // 브랜드 생성 추이 업데이트 (실제 데이터로 계산 가능)
    updateShopTrendData(shops)

  } catch (error) {
    console.error('대시보드 데이터 로드 실패:', error)
    // 에러 발생시 기본 더미 데이터 유지
    stats.value = {
      totalShops: 127,
      totalProducts: 2486,
      activeUsers: 342,
      newShopsThisMonth: 12,
      newProductsThisWeek: 18,
      newUsersThisWeek: 24
    }
  } finally {
    loading.value = false
  }
}

const updateShopTrendData = (shops) => {
  // 최근 6개월 데이터 계산
  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
  const currentMonth = new Date().getMonth()
  const trendData = []

  for (let i = 5; i >= 0; i--) {
    const targetMonth = (currentMonth - i + 12) % 12
    const monthShops = shops.filter(shop => {
      const shopMonth = new Date(shop.createdAt).getMonth()
      return shopMonth === targetMonth
    }).length

    trendData.push({
      month: monthNames[targetMonth],
      shops: monthShops
    })
  }

  shopTrendData.value = trendData
}

const refreshData = async () => {
  await loadDashboardData()
  toast.success('데이터가 새로고침되었습니다.')
}

const getActivityIconClass = (type) => {
  const classes = {
    shop_created: 'bg-gradient-to-br from-green-500 to-emerald-600',
    product_added: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    user_registered: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    review_added: 'bg-gradient-to-br from-purple-500 to-pink-600'
  }
  return classes[type] || 'bg-gradient-to-br from-gray-500 to-gray-600'
}

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInMinutes < 1) return '방금 전'
  if (diffInMinutes < 60) return `${diffInMinutes}분 전`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}시간 전`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}일 전`

  return date.toLocaleDateString('ko-KR')
}
</script>