<template>
  <AdminLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">대시보드</h1>
        <p class="text-gray-600">시스템 현황을 한눈에 확인하세요</p>
      </div>

      <!-- 통계 카드들 -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">총 상점 수</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalShops }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">총 상품 수</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalProducts }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">총 게시판 수</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalBoards }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">활성 사용자</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.activeUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 차트 섹션 -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- 상점 생성 추이 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">상점 생성 추이</h3>
          <canvas ref="shopChart" class="w-full h-64"></canvas>
        </div>

        <!-- 게시물 통계 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">게시물 통계</h3>
          <canvas ref="postChart" class="w-full h-64"></canvas>
        </div>
      </div>

      <!-- 최근 활동 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">최근 활동</h3>

          <div class="flow-root">
            <ul class="-mb-8">
              <li v-for="(activity, index) in recentActivities" :key="activity.id">
                <div class="relative pb-8" :class="{ 'pb-0': index === recentActivities.length - 1 }">
                  <span
                      v-if="index !== recentActivities.length - 1"
                      class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  ></span>

                  <div class="relative flex space-x-3">
                    <div>
                      <span
                          class="h-8 w-8 rounded-full flex items-center justify-center"
                          :class="getActivityIconClass(activity.type)"
                      >
                        <component :is="getActivityIcon(activity.type)" class="w-5 h-5" />
                      </span>
                    </div>

                    <div class="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p class="text-sm text-gray-500">
                          {{ activity.description }}
                        </p>
                      </div>
                      <div class="text-right text-sm whitespace-nowrap text-gray-500">
                        {{ formatRelativeTime(activity.createdAt) }}
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
  </AdminLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const shopStore = useShopStore()
const boardStore = useBoardStore()

const stats = ref({
  totalShops: 0,
  totalProducts: 0,
  totalBoards: 0,
  activeUsers: 0
})

const recentActivities = ref([])
const shopChart = ref(null)
const postChart = ref(null)

onMounted(async () => {
  await loadDashboardData()
  await initCharts()
})

const loadDashboardData = async () => {
  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const dashboardData = await $fetch(`${config.public.apiBase}/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    stats.value = dashboardData.stats
    recentActivities.value = dashboardData.recentActivities
  } catch (error) {
    console.error('대시보드 데이터 로드 실패:', error)
  }
}

const initCharts = async () => {
  if (process.client) {
    const Chart = await import('chart.js/auto')

    // 상점 생성 추이 차트
    if (shopChart.value) {
      new Chart.default(shopChart.value, {
        type: 'line',
        data: {
          labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
          datasets: [{
            label: '생성된 상점 수',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }

    // 게시물 통계 차트
    if (postChart.value) {
      new Chart.default(postChart.value, {
        type: 'doughnut',
        data: {
          labels: ['공지사항', '일반 게시물', 'FAQ'],
          datasets: [{
            data: [30, 50, 20],
            backgroundColor: [
              'rgb(239, 68, 68)',
              'rgb(59, 130, 246)',
              'rgb(34, 197, 94)'
            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      })
    }
  }
}

const getActivityIconClass = (type) => {
  const classes = {
    shop_created: 'bg-green-100 text-green-800',
    product_added: 'bg-blue-100 text-blue-800',
    post_created: 'bg-purple-100 text-purple-800',
    user_registered: 'bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getActivityIcon = (type) => {
  // 아이콘 컴포넌트 반환 (실제로는 heroicons 등 사용)
  return 'div'
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