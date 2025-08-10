<template>
  <div class="space-y-8">
    <!-- 상단 통계 및 액션 영역 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 통계 카드들 -->
      <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-blue-100 text-sm font-medium">총 상점 수</p>
              <p class="text-3xl font-bold">{{ totalShops }}</p>
              <p class="text-blue-200 text-xs mt-1">+{{ newShopsThisMonth }}개 이번 달</p>
            </div>
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-emerald-100 text-sm font-medium">활성 상점</p>
              <p class="text-3xl font-bold">{{ activeShops }}</p>
              <p class="text-emerald-200 text-xs mt-1">{{ Math.round((activeShops/totalShops)*100) }}% 활성화율</p>
            </div>
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-purple-100 text-sm font-medium">총 상품 수</p>
              <p class="text-3xl font-bold">{{ totalProducts }}</p>
              <p class="text-purple-200 text-xs mt-1">{{ Math.round(totalProducts/totalShops) }}개 평균</p>
            </div>
            <div class="p-3 bg-white/20 rounded-lg">
              <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 빠른 액션 -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">빠른 작업</h3>
        <div class="space-y-3">
          <button
              @click="showCreateModal = true"
              class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            새 상점 생성
          </button>

          <button class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            데이터 내보내기
          </button>

          <button class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            일괄 설정
          </button>
        </div>
      </div>
    </div>

    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1 max-w-lg">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="상점명, 설명으로 검색..."
                class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <select
              v-model="statusFilter"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>

          <select
              v-model="sortBy"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="name">이름순</option>
            <option value="products">상품수순</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 상점 목록 -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          등록된 상점 <span class="text-blue-600">({{ filteredShops.length }}개)</span>
        </h2>
        <div class="flex items-center space-x-2">
          <button
              @click="viewMode = 'grid'"
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
              @click="viewMode = 'list'"
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- 그리드 뷰 -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="shop in filteredShops"
            :key="shop.id"
            class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        >
          <!-- 상점 이미지/아이콘 -->
          <div class="h-32 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-bold text-lg truncate">{{ shop.name }}</h3>
              <p class="text-white/80 text-sm">{{ shop.ownerName || '미정' }}</p>
            </div>
            <div class="absolute top-4 right-4">
              <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="shop.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'"
              >
                {{ shop.isActive ? '활성' : '비활성' }}
              </span>
            </div>
          </div>

          <!-- 상점 정보 -->
          <div class="p-6">
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ shop.description || '설명이 없습니다.' }}
            </p>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ shop.productCount || 0 }}</p>
                <p class="text-xs text-gray-500">상품 수</p>
              </div>
              <div class="text-center">
                <p class="text-2xl font-bold text-gray-900">{{ shop.orderCount || 0 }}</p>
                <p class="text-xs text-gray-500">주문 수</p>
              </div>
            </div>

            <div class="text-xs text-gray-500 mb-4">
              생성일: {{ formatDate(shop.createdAt) }}
            </div>

            <!-- 액션 버튼들 -->
            <div class="flex space-x-2">
              <NuxtLink
                  :to="`/shops/${shop.id}`"
                  class="flex-1 bg-blue-50 text-blue-700 text-center py-2 px-3 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                관리
              </NuxtLink>
              <button
                  @click="toggleShopStatus(shop)"
                  class="flex-1 text-center py-2 px-3 rounded-lg transition-colors text-sm font-medium"
                  :class="shop.isActive
                    ? 'bg-red-50 text-red-700 hover:bg-red-100'
                    : 'bg-green-50 text-green-700 hover:bg-green-100'"
              >
                {{ shop.isActive ? '비활성화' : '활성화' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 리스트 뷰 -->
      <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상점</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품/주문</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">생성일</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">작업</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr
                v-for="shop in filteredShops"
                :key="shop.id"
                class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-12 w-12">
                    <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span class="text-white font-bold text-lg">{{ shop.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ shop.name }}</div>
                    <div class="text-sm text-gray-500">{{ shop.ownerName || '미정' }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                  <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="shop.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'"
                  >
                    {{ shop.isActive ? '활성' : '비활성' }}
                  </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="flex space-x-4">
                  <span>상품 {{ shop.productCount || 0 }}개</span>
                  <span class="text-gray-300">|</span>
                  <span>주문 {{ shop.orderCount || 0 }}개</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(shop.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <NuxtLink
                    :to="`/shops/${shop.id}`"
                    class="text-blue-600 hover:text-blue-900 transition-colors"
                >
                  관리
                </NuxtLink>
                <button
                    @click="toggleShopStatus(shop)"
                    class="transition-colors"
                    :class="shop.isActive
                        ? 'text-red-600 hover:text-red-900'
                        : 'text-green-600 hover:text-green-900'"
                >
                  {{ shop.isActive ? '비활성화' : '활성화' }}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 빈 상태 -->
      <div v-if="!loading && filteredShops.length === 0" class="text-center py-12">
        <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">상점이 없습니다</h3>
        <p class="text-gray-500 mb-6">첫 번째 상점을 생성해보세요!</p>
        <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          상점 생성하기
        </button>
      </div>
    </div>

    <!-- 상점 생성 모달 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 rounded-t-2xl">
          <h3 class="text-lg font-semibold text-white">새 상점 생성</h3>
          <p class="text-blue-100 text-sm mt-1">새로운 온라인 상점을 만들어보세요</p>
        </div>

        <form @submit.prevent="handleCreateShop" class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">상점명 *</label>
            <input
                v-model="createForm.name"
                type="text"
                required
                placeholder="예: 맛있는 베이커리"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">상점 설명</label>
            <textarea
                v-model="createForm.description"
                rows="3"
                placeholder="상점에 대한 간단한 설명을 입력하세요"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">운영 기간 (일) *</label>
            <input
                v-model="createForm.activeDays"
                type="number"
                min="1"
                max="365"
                required
                placeholder="30"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <p class="text-xs text-gray-500 mt-1">설정한 기간 동안 상점이 활성화됩니다</p>
          </div>

          <div class="flex items-center">
            <input
                v-model="createForm.autoActivate"
                type="checkbox"
                id="autoActivate"
                class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="autoActivate" class="ml-2 block text-sm text-gray-700">
              생성 즉시 활성화
            </label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
                type="button"
                @click="showCreateModal = false"
                class="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
                type="submit"
                :disabled="creating"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ creating ? '생성 중...' : '상점 생성' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const shopStore = useShopStore()

// 상태 관리
const loading = ref(false)
const creating = ref(false)
const showCreateModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')
const viewMode = ref('grid')

// 폼 데이터
const createForm = reactive({
  name: '',
  description: '',
  activeDays: 30,
  autoActivate: true
})

// 더미 데이터 (실제로는 API에서 가져옴)
const shops = ref([
  {
    id: 1,
    name: '맛있는 베이커리',
    description: '매일 아침 구워내는 신선한 빵을 만나보세요',
    ownerName: '김영희',
    isActive: true,
    productCount: 24,
    orderCount: 156,
    createdAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: '스타일 패션',
    description: '트렌디한 의류와 액세서리',
    ownerName: '이철수',
    isActive: true,
    productCount: 89,
    orderCount: 203,
    createdAt: new Date('2024-02-03')
  },
  {
    id: 3,
    name: '홈&리빙',
    description: '집을 아름답게 꾸미는 인테리어 소품',
    ownerName: '박지영',
    isActive: false,
    productCount: 45,
    orderCount: 78,
    createdAt: new Date('2024-01-28')
  },
  {
    id: 4,
    name: '테크 가젯',
    description: '최신 전자기기와 IT 액세서리',
    ownerName: '정민수',
    isActive: true,
    productCount: 67,
    orderCount: 134,
    createdAt: new Date('2024-02-10')
  },
  {
    id: 5,
    name: '건강한 식품',
    description: '유기농 식품과 건강 보조제',
    ownerName: '최수진',
    isActive: true,
    productCount: 32,
    orderCount: 89,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 6,
    name: '펫샵 러브',
    description: '반려동물을 위한 모든 것',
    ownerName: '윤성호',
    isActive: false,
    productCount: 56,
    orderCount: 67,
    createdAt: new Date('2024-01-20')
  }
])

// 계산된 속성
const totalShops = computed(() => shops.value.length)
const activeShops = computed(() => shops.value.filter(shop => shop.isActive).length)
const totalProducts = computed(() => shops.value.reduce((sum, shop) => sum + (shop.productCount || 0), 0))
const newShopsThisMonth = computed(() => {
  const thisMonth = new Date().getMonth()
  return shops.value.filter(shop => new Date(shop.createdAt).getMonth() === thisMonth).length
})

const filteredShops = computed(() => {
  let filtered = [...shops.value]

  // 검색 필터
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(query) ||
        shop.description?.toLowerCase().includes(query)
    )
  }

  // 상태 필터
  if (statusFilter.value) {
    filtered = filtered.filter(shop => {
      if (statusFilter.value === 'active') return shop.isActive
      if (statusFilter.value === 'inactive') return !shop.isActive
      return true
    })
  }

  // 정렬
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'products':
        return (b.productCount || 0) - (a.productCount || 0)
      default:
        return 0
    }
  })

  return filtered
})

// 생명주기
onMounted(async () => {
  await loadShops()
})

// 메서드
const loadShops = async () => {
  loading.value = true
  try {
    // 실제로는 shopStore.fetchShops() 호출
    await new Promise(resolve => setTimeout(resolve, 500)) // 로딩 시뮬레이션
  } catch (error) {
    console.error('상점 목록 로드 실패:', error)
  } finally {
    loading.value = false
  }
}

const handleCreateShop = async () => {
  creating.value = true
  try {
    // 실제로는 shopStore.createShop(createForm) 호출
    await new Promise(resolve => setTimeout(resolve, 1000)) // 생성 시뮬레이션

    // 새 상점 추가 (실제로는 API 응답으로 받음)
    const newShop = {
      id: Date.now(),
      ...createForm,
      isActive: createForm.autoActivate,
      productCount: 0,
      orderCount: 0,
      createdAt: new Date()
    }
    shops.value.unshift(newShop)

    // 폼 초기화
    Object.assign(createForm, {
      name: '',
      description: '',
      activeDays: 30,
      autoActivate: true
    })

    showCreateModal.value = false
  } catch (error) {
    console.error('상점 생성 실패:', error)
  } finally {
    creating.value = false
  }
}

const toggleShopStatus = async (shop) => {
  try {
    // 실제로는 shopStore.updateShopStatus(shop.id, !shop.isActive) 호출
    shop.isActive = !shop.isActive
  } catch (error) {
    console.error('상점 상태 변경 실패:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>