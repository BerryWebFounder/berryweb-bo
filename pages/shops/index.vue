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
              <p class="text-3xl font-bold">{{ stats.totalShops }}</p>
              <p class="text-blue-200 text-xs mt-1">+{{ stats.newShopsThisMonth }}개 이번 달</p>
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
              <p class="text-3xl font-bold">{{ stats.activeShops }}</p>
              <p class="text-emerald-200 text-xs mt-1">{{ stats.activeShopsPercent }}% 활성화율</p>
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
              <p class="text-3xl font-bold">{{ stats.totalProducts }}</p>
              <p class="text-purple-200 text-xs mt-1">{{ stats.avgProductsPerShop }}개 평균</p>
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

          <button
              @click="exportData"
              class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            데이터 내보내기
          </button>

          <button
              @click="refreshData"
              class="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            새로고침
          </button>
        </div>
      </div>
    </div>

    <!-- 검색 및 필터 -->
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1 max-w-lg">
          <SearchInput
              v-model="searchQuery"
              placeholder="상점명으로 검색..."
              @update:modelValue="handleSearch"
          />
        </div>

        <div class="flex items-center space-x-4">
          <select
              v-model="filters.status"
              @change="applyFilters"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">전체 상태</option>
            <option value="true">활성</option>
            <option value="false">비활성</option>
          </select>

          <select
              v-model="filters.sortBy"
              @change="applyFilters"
              class="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="createdAt,desc">최신순</option>
            <option value="createdAt,asc">오래된순</option>
            <option value="name,asc">이름순</option>
            <option value="productCount,desc">상품수순</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 상점 목록 -->
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">
          등록된 상점 <span class="text-blue-600">({{ shops.length }}개)</span>
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
      <LoadingSpinner v-if="shopStore.loading" text="상점 목록을 불러오는 중..." />

      <!-- 에러 상태 -->
      <ErrorMessage
          v-else-if="shopStore.error"
          type="error"
          title="데이터 로드 실패"
          :message="shopStore.error"
          :retry="true"
          @retry="loadShops"
      />

      <!-- 그리드 뷰 -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="shop in shops"
            :key="shop.id"
            class="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
        >
          <!-- 상점 헤더 -->
          <div class="h-32 bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
            <div class="absolute inset-0 bg-black/20"></div>
            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-bold text-lg truncate">{{ shop.name }}</h3>
              <p class="text-white/80 text-sm">{{ shop.ownerUsername || '미정' }}</p>
            </div>
            <div class="absolute top-4 right-4">
              <StatusBadge :status="shop.isActive ? 'active' : 'inactive'" />
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
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(shop.minOrderAmount || 0) }}</p>
                <p class="text-xs text-gray-500">최소 주문금액</p>
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
      <DataTable
          v-else
          :data="shops"
          :columns="shopColumns"
          :loading="shopStore.loading"
      >
        <template #cell-name="{ item }">
          <div class="flex items-center">
            <div class="flex-shrink-0 h-12 w-12">
              <div class="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ item.name.charAt(0) }}</span>
              </div>
            </div>
            <div class="ml-4">
              <div class="text-sm font-medium text-gray-900">{{ item.name }}</div>
              <div class="text-sm text-gray-500">{{ item.ownerUsername || '미정' }}</div>
            </div>
          </div>
        </template>

        <template #cell-status="{ item }">
          <StatusBadge :status="item.isActive ? 'active' : 'inactive'" />
        </template>

        <template #cell-info="{ item }">
          <div class="text-sm">
            <div>상품: {{ item.productCount || 0 }}개</div>
            <div>최소주문: {{ formatCurrency(item.minOrderAmount || 0) }}</div>
          </div>
        </template>

        <template #actions="{ item }">
          <div class="flex space-x-2">
            <NuxtLink
                :to="`/shops/${item.id}`"
                class="text-blue-600 hover:text-blue-900 transition-colors text-sm"
            >
              관리
            </NuxtLink>
            <button
                @click="toggleShopStatus(item)"
                class="transition-colors text-sm"
                :class="item.isActive
                  ? 'text-red-600 hover:text-red-900'
                  : 'text-green-600 hover:text-green-900'"
            >
              {{ item.isActive ? '비활성화' : '활성화' }}
            </button>
          </div>
        </template>
      </DataTable>

      <!-- 빈 상태 -->
      <div v-if="!shopStore.loading && !shopStore.error && shops.length === 0" class="text-center py-12">
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
    <Modal v-model:show="showCreateModal" title="새 상점 생성" size="lg">
      <form @submit.prevent="handleCreateShop">
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">상점명 *</label>
              <input
                  v-model="createForm.name"
                  type="text"
                  required
                  placeholder="예: 맛있는 베이커리"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">사업자등록번호</label>
              <input
                  v-model="createForm.businessNumber"
                  type="text"
                  placeholder="000-00-00000"
                  class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">상점 설명</label>
            <textarea
                v-model="createForm.description"
                rows="3"
                placeholder="상점에 대한 간단한 설명을 입력하세요"
                class="form-textarea"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
              <input
                  v-model="createForm.phone"
                  type="tel"
                  placeholder="01012345678"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
              <input
                  v-model="createForm.email"
                  type="email"
                  placeholder="shop@example.com"
                  class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">주소</label>
            <input
                v-model="createForm.address"
                type="text"
                placeholder="서울시 강남구..."
                class="form-input"
            />
          </div>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">최소 주문금액</label>
              <input
                  v-model.number="createForm.minOrderAmount"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">배송비</label>
              <input
                  v-model.number="createForm.deliveryFee"
                  type="number"
                  min="0"
                  placeholder="3000"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">무료배송 금액</label>
              <input
                  v-model.number="createForm.freeDeliveryAmount"
                  type="number"
                  min="0"
                  placeholder="50000"
                  class="form-input"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">영업시간</label>
            <input
                v-model="createForm.businessHours"
                type="text"
                placeholder="평일 09:00-18:00, 주말 10:00-17:00"
                class="form-input"
            />
          </div>
        </div>
      </form>

      <template #footer>
        <button
            @click="showCreateModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          취소
        </button>
        <button
            @click="handleCreateShop"
            :disabled="creating"
            class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ creating ? '생성 중...' : '상점 생성' }}
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin'
})

const shopStore = useShopStore()
const toast = useToast()

// 상태 관리
const shops = ref([])
const stats = ref({
  totalShops: 0,
  activeShops: 0,
  totalProducts: 0,
  newShopsThisMonth: 0,
  activeShopsPercent: 0,
  avgProductsPerShop: 0
})

const loading = ref(false)
const creating = ref(false)
const showCreateModal = ref(false)
const searchQuery = ref('')
const viewMode = ref('grid')

const filters = reactive({
  status: '',
  sortBy: 'createdAt,desc'
})

const createForm = reactive({
  name: '',
  description: '',
  businessNumber: '',
  phone: '',
  email: '',
  address: '',
  minOrderAmount: 0,
  deliveryFee: 0,
  freeDeliveryAmount: 0,
  businessHours: ''
})

const shopColumns = [
  { key: 'name', label: '상점' },
  { key: 'status', label: '상태' },
  { key: 'info', label: '상품/주문 정보' },
  { key: 'createdAt', label: '생성일', type: 'date' }
]

// 생명주기
onMounted(async () => {
  await loadShops()
})

// 메서드
const loadShops = async () => {
  try {
    const params = {}

    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    if (filters.status !== '') {
      params.isActive = filters.status
    }

    if (filters.sortBy) {
      const [field, direction] = filters.sortBy.split(',')
      params.sort = `${field},${direction}`
    }

    await shopStore.fetchShops(params)
    shops.value = shopStore.shops

    // 통계 계산
    calculateStats()

  } catch (error) {
    toast.error('상점 목록을 불러오는데 실패했습니다.')
    console.error('상점 목록 로드 실패:', error)
  }
}

const calculateStats = () => {
  const totalShops = shops.value.length
  const activeShops = shops.value.filter(shop => shop.isActive).length
  const totalProducts = shops.value.reduce((sum, shop) => sum + (shop.productCount || 0), 0)

  // 이번 달 생성된 상점 계산
  const thisMonth = new Date().getMonth()
  const newShopsThisMonth = shops.value.filter(shop => {
    const createdMonth = new Date(shop.createdAt).getMonth()
    return createdMonth === thisMonth
  }).length

  stats.value = {
    totalShops,
    activeShops,
    totalProducts,
    newShopsThisMonth,
    activeShopsPercent: totalShops > 0 ? Math.round((activeShops / totalShops) * 100) : 0,
    avgProductsPerShop: totalShops > 0 ? Math.round(totalProducts / totalShops) : 0
  }
}

const handleCreateShop = async () => {
  creating.value = true
  try {
    await shopStore.createShop(createForm)
    showCreateModal.value = false

    // 폼 초기화
    Object.assign(createForm, {
      name: '',
      description: '',
      businessNumber: '',
      phone: '',
      email: '',
      address: '',
      minOrderAmount: 0,
      deliveryFee: 0,
      freeDeliveryAmount: 0,
      businessHours: ''
    })

    toast.success('상점이 성공적으로 생성되었습니다.')
    await loadShops()

  } catch (error) {
    toast.error(error.message || '상점 생성에 실패했습니다.')
  } finally {
    creating.value = false
  }
}

const toggleShopStatus = async (shop) => {
  try {
    const updatedShop = await shopStore.updateShop(shop.id, {
      ...shop,
      isActive: !shop.isActive
    })

    // 로컬 상태 업데이트
    const index = shops.value.findIndex(s => s.id === shop.id)
    if (index !== -1) {
      shops.value[index] = updatedShop
    }

    calculateStats()
    toast.success(`상점이 ${updatedShop.isActive ? '활성화' : '비활성화'}되었습니다.`)

  } catch (error) {
    toast.error('상점 상태 변경에 실패했습니다.')
    console.error('상점 상태 변경 실패:', error)
  }
}

const handleSearch = debounce(async () => {
  await loadShops()
}, 500)

const applyFilters = async () => {
  await loadShops()
}

const refreshData = async () => {
  await loadShops()
  toast.success('데이터가 새로고침되었습니다.')
}

const exportData = () => {
  // CSV 내보내기 구현
  const csvData = shops.value.map(shop => ({
    상점명: shop.name,
    소유자: shop.ownerUsername,
    상태: shop.isActive ? '활성' : '비활성',
    상품수: shop.productCount || 0,
    생성일: formatDate(shop.createdAt)
  }))

  const csv = convertToCSV(csvData)
  downloadCSV(csv, `shops_${new Date().toISOString().split('T')[0]}.csv`)
  toast.success('데이터가 내보내졌습니다.')
}

// 유틸리티 함수
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount || 0)
}

function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function convertToCSV(data) {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')

  return csvContent
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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