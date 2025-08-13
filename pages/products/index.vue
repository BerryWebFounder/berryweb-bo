<template>
  <div class="space-y-8">
    <!-- 헤더 영역 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">상품 관리</h2>
        <p class="mt-2 text-gray-600">등록된 상품을 관리하고 상품 정보를 수정할 수 있습니다</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button
            @click="showCreateModal = true"
            class="btn-primary"
            v-if="authStore.isModerator"
        >
          <Icon name="plus" size="sm" class="mr-2" />
          새 상품 등록
        </button>
      </div>
    </div>

    <!-- 연결 상태 표시 -->
    <div v-if="connectionError" class="card border-l-4 border-l-red-500">
      <div class="p-4">
        <div class="flex items-center">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <Icon name="close" size="md" color="red" />
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">상품 API 서버 연결 실패</h3>
            <p class="text-sm text-gray-600">{{ connectionError }}</p>
          </div>
        </div>
        <div class="mt-4">
          <button @click="retryConnection" class="btn-primary btn-sm">
            <Icon name="analytics" size="sm" class="mr-2" />
            다시 시도
          </button>
        </div>
      </div>
    </div>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 전체 상품 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">전체 상품</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ formatNumber(productsStore.stats.totalProducts) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="orders" size="lg" color="blue" />
          </div>
        </div>
      </div>

      <!-- 활성 상품 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">활성 상품</p>
            <p class="text-3xl font-bold text-green-600">
              {{ formatNumber(productsStore.stats.activeProducts) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              비활성: {{ formatNumber(productsStore.stats.inactiveProducts) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="plus" size="lg" color="green" />
          </div>
        </div>
      </div>

      <!-- 추천 상품 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">추천 상품</p>
            <p class="text-3xl font-bold text-purple-600">
              {{ formatNumber(productsStore.stats.featuredProducts) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              재고 부족: {{ formatNumber(productsStore.stats.lowStockProducts) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="notification" size="lg" color="purple" />
          </div>
        </div>
      </div>

      <!-- 품절 상품 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">품절 상품</p>
            <p class="text-3xl font-bold text-red-600">
              {{ formatNumber(productsStore.stats.outOfStockProducts) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              평균 가격: {{ formatCurrency(productsStore.stats.averagePrice) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="close" size="lg" color="red" />
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 영역 -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <!-- 카테고리 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
          <select v-model="filters.category" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="fashion">패션</option>
            <option value="electronics">전자제품</option>
            <option value="books">도서</option>
            <option value="food">식품</option>
            <option value="beauty">뷰티</option>
            <option value="sports">스포츠</option>
            <option value="etc">기타</option>
          </select>
        </div>

        <!-- 브랜드 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">브랜드</label>
          <select v-model="filters.brand" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="samsung">삼성</option>
            <option value="apple">애플</option>
            <option value="nike">나이키</option>
            <option value="adidas">아디다스</option>
          </select>
        </div>

        <!-- 상태 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
          <select v-model="filters.status" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>

        <!-- 재고 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">재고</label>
          <select v-model="filters.inStock" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="true">재고 있음</option>
            <option value="false">품절</option>
            <option value="low">재고 부족</option>
          </select>
        </div>

        <!-- 추천 여부 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">추천</label>
          <select v-model="filters.featured" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="true">추천 상품</option>
            <option value="false">일반 상품</option>
          </select>
        </div>
      </div>

      <!-- 가격 범위 필터 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">최소 가격</label>
          <input
              v-model="filters.minPrice"
              type="number"
              class="form-input"
              placeholder="0"
              @input="debounceFilters"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">최대 가격</label>
          <input
              v-model="filters.maxPrice"
              type="number"
              class="form-input"
              placeholder="무제한"
              @input="debounceFilters"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">정렬</label>
          <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
            <option value="createdAt">등록일</option>
            <option value="name">상품명</option>
            <option value="price">가격</option>
            <option value="stock">재고</option>
            <option value="rating">평점</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">순서</label>
          <select v-model="filters.sortOrder" class="form-select" @change="applyFilters">
            <option value="desc">내림차순</option>
            <option value="asc">올림차순</option>
          </select>
        </div>
      </div>

      <!-- 키워드 검색 -->
      <div class="flex items-center space-x-4">
        <div class="relative flex-1">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="상품명, SKU, 브랜드로 검색..."
              class="form-input pl-10"
              @keyup.enter="handleSearch"
              @input="debounceSearch"
          >
          <Icon name="search" size="sm" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button
            @click="resetFilters"
            class="btn-secondary"
        >
          필터 초기화
        </button>

        <button
            @click="refreshData"
            class="btn-secondary"
            :disabled="productsStore.loading"
        >
          <Icon
              name="analytics"
              size="sm"
              :class="{ 'animate-spin': productsStore.loading }"
          />
        </button>
      </div>
    </div>

    <!-- 일괄 선택 액션 -->
    <div v-if="selectedProductIds.length > 0" class="card p-4 border-l-4 border-l-blue-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-900">{{ selectedProductIds.length }}개 상품 선택됨</span>
          <div class="flex items-center space-x-2">
            <button
                @click="bulkToggleStatus(true)"
                class="btn-success btn-sm"
            >
              활성화
            </button>
            <button
                @click="bulkToggleStatus(false)"
                class="btn-warning btn-sm"
            >
              비활성화
            </button>
            <button
                @click="bulkToggleFeatured(true)"
                class="btn-info btn-sm"
            >
              추천 설정
            </button>
            <button
                @click="bulkDelete"
                class="btn-danger btn-sm"
            >
              삭제
            </button>
          </div>
        </div>
        <button
            @click="selectedProductIds = []"
            class="text-gray-400 hover:text-gray-600"
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
    </div>

    <!-- 상품 목록 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="table-header">
          <tr>
            <th class="table-header-cell w-12">
              <input
                  type="checkbox"
                  :checked="selectedProductIds.length === productsStore.products.length && productsStore.products.length > 0"
                  @change="toggleAllProducts"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </th>
            <th class="table-header-cell">상품 정보</th>
            <th class="table-header-cell">카테고리/브랜드</th>
            <th class="table-header-cell">가격/재고</th>
            <th class="table-header-cell">상태</th>
            <th class="table-header-cell">평점</th>
            <th class="table-header-cell">등록일</th>
            <th class="table-header-cell">관리</th>
          </tr>
          </thead>
          <tbody class="table-body">
          <tr
              v-for="product in productsStore.products"
              :key="product.id"
              class="hover:bg-gray-50"
              :class="{ 'bg-blue-50': selectedProductIds.includes(product.id) }"
          >
            <!-- 선택 체크박스 -->
            <td class="table-cell">
              <input
                  type="checkbox"
                  :value="product.id"
                  v-model="selectedProductIds"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </td>

            <!-- 상품 정보 -->
            <td class="table-cell">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                      v-if="product.images && product.images[0]"
                      :src="product.images[0]"
                      :alt="product.name"
                      class="w-full h-full object-cover"
                  >
                  <Icon v-else name="orders" size="lg" color="gray" />
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.shopName }}</div>
                  <div class="text-xs text-gray-400">SKU: {{ product.sku }}</div>
                </div>
              </div>
            </td>

            <!-- 카테고리/브랜드 -->
            <td class="table-cell">
              <div class="space-y-1">
                <Badge
                    :variant="getCategoryVariant(product.category)"
                    :text="getCategoryDisplayName(product.category)"
                    size="sm"
                />
                <div class="text-xs text-gray-500">{{ product.brand }}</div>
              </div>
            </td>

            <!-- 가격/재고 -->
            <td class="table-cell">
              <div class="space-y-1">
                <div class="font-medium text-gray-900">{{ formatCurrency(product.price) }}</div>
                <div class="text-sm" :class="getStockColorClass(product.stock)">
                  재고: {{ product.stock }}개
                </div>
              </div>
            </td>

            <!-- 상태 -->
            <td class="table-cell">
              <div class="space-y-1">
                <Badge
                    :variant="product.isActive ? 'success' : 'danger'"
                    :text="product.isActive ? '활성' : '비활성'"
                    size="sm"
                />
                <Badge
                    v-if="product.isFeatured"
                    variant="warning"
                    text="추천"
                    size="sm"
                />
              </div>
            </td>

            <!-- 평점 -->
            <td class="table-cell">
              <div class="flex items-center space-x-1">
                <span class="text-yellow-400">⭐</span>
                <span class="text-sm font-medium">{{ (product.rating || 0).toFixed(1) }}</span>
                <span class="text-xs text-gray-500">({{ product.reviewCount || 0 }})</span>
              </div>
            </td>

            <!-- 등록일 -->
            <td class="table-cell text-gray-500">
              <div class="text-sm">{{ formatDate(product.createdAt) }}</div>
              <div class="text-xs">{{ formatTime(product.createdAt) }}</div>
            </td>

            <!-- 관리 -->
            <td class="table-cell">
              <div class="flex items-center space-x-2">
                <!-- 상세 보기 -->
                <NuxtLink
                    :to="`/products/${product.id}`"
                    class="text-blue-600 hover:text-blue-700"
                    title="상세 보기"
                >
                  <Icon name="eye" size="sm" />
                </NuxtLink>

                <!-- 수정 -->
                <button
                    @click="editProduct(product)"
                    class="text-green-600 hover:text-green-700"
                    title="수정"
                >
                  <Icon name="edit" size="sm" />
                </button>

                <!-- 추천 토글 -->
                <button
                    @click="toggleProductFeatured(product)"
                    :class="product.isFeatured ? 'text-yellow-600 hover:text-yellow-700' : 'text-gray-400 hover:text-yellow-600'"
                    title="추천 토글"
                >
                  <Icon name="notification" size="sm" />
                </button>

                <!-- 상태 토글 -->
                <button
                    @click="toggleProductStatus(product)"
                    :class="product.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'"
                    :title="product.isActive ? '비활성화' : '활성화'"
                >
                  <Icon :name="product.isActive ? 'close' : 'plus'" size="sm" />
                </button>

                <!-- 삭제 -->
                <button
                    @click="confirmDelete(product)"
                    class="text-red-600 hover:text-red-700"
                    title="삭제"
                >
                  <Icon name="delete" size="sm" />
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>

        <!-- 빈 상태 -->
        <div v-if="productsStore.products.length === 0 && !productsStore.loading" class="text-center py-12">
          <Icon name="orders" size="xl" color="gray" class="mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">등록된 상품이 없습니다</h3>
          <p class="text-gray-500 mb-4">첫 번째 상품을 등록해보세요.</p>
          <button
              @click="showCreateModal = true"
              class="btn-primary"
              v-if="authStore.isModerator"
          >
            <Icon name="plus" size="sm" class="mr-2" />
            상품 등록
          </button>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="productsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <Pagination
          v-if="productsStore.pagination.totalPages > 1"
          :current-page="productsStore.pagination.page + 1"
          :page-size="productsStore.pagination.size"
          :total="productsStore.pagination.totalElements"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- 상품 생성/수정 모달 -->
    <ProductModal
        v-if="showCreateModal || editingProduct"
        :product="editingProduct"
        @close="closeModal"
        @submit="handleSubmit"
    />

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
        v-if="deletingProduct"
        :title="`상품 삭제`"
        :message="`'${deletingProduct.name}' 상품을 삭제하시겠습니까?`"
        :show-warning="true"
        :warning-message="'상품과 모든 리뷰, 주문 내역이 함께 삭제됩니다.'"
        @confirm="handleDelete"
        @cancel="deletingProduct = null"
    />
  </div>
</template>

<script setup>
// 인증 미들웨어 적용 (운영자 이상)
definePageMeta({
  middleware: ['auth', 'moderator-auth']
})

const productsStore = useProductsStore()
const authStore = useAuthStore()

// 반응형 데이터
const searchQuery = ref('')
const showCreateModal = ref(false)
const editingProduct = ref(null)
const deletingProduct = ref(null)
const selectedProductIds = ref([])
const connectionError = ref('')

// 필터 상태
const filters = ref({
  category: 'all',
  brand: 'all',
  status: 'all',
  inStock: 'all',
  featured: 'all',
  minPrice: '',
  maxPrice: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// 디바운스 타이머
let searchTimeout = null
let filtersTimeout = null

// 페이지 로드 시 데이터 초기화
onMounted(async () => {
  console.log('상품 관리 페이지 마운트됨')
  await initializeData()
})

// 데이터 초기화
const initializeData = async () => {
  try {
    console.log('상품 데이터 초기화 시작')
    connectionError.value = ''
    await productsStore.initialize()
    console.log('상품 데이터 초기화 완료')
  } catch (error) {
    console.error('상품 데이터 초기화 실패:', error)
    connectionError.value = getErrorMessage(error)
  }
}

// 연결 재시도
const retryConnection = async () => {
  console.log('연결 재시도')
  await initializeData()
}

// 에러 메시지 생성
const getErrorMessage = (error) => {
  if (error.message) {
    if (error.message.includes('fetch')) {
      return '상품 API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
    }
    return error.message
  }
  return '알 수 없는 오류가 발생했습니다.'
}

// 유틸리티 함수들
const formatNumber = (num) => {
  return new Intl.NumberFormat('ko-KR').format(num || 0)
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount || 0)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('ko-KR')
}

const formatTime = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getCategoryVariant = (category) => {
  const variants = {
    fashion: 'info',
    electronics: 'primary',
    books: 'success',
    food: 'warning',
    beauty: 'danger',
    sports: 'info',
    etc: 'gray'
  }
  return variants[category] || 'gray'
}

const getCategoryDisplayName = (category) => {
  const names = {
    fashion: '패션',
    electronics: '전자제품',
    books: '도서',
    food: '식품',
    beauty: '뷰티',
    sports: '스포츠',
    etc: '기타'
  }
  return names[category] || category
}

const getStockColorClass = (stock) => {
  if (stock === 0) return 'text-red-600'
  if (stock <= 10) return 'text-yellow-600'
  return 'text-gray-500'
}

// 검색 및 필터링
const applyFilters = () => {
  console.log('필터 적용:', filters.value)
  productsStore.updateFilters(filters.value)
  productsStore.fetchProducts()
}

const debounceFilters = () => {
  clearTimeout(filtersTimeout)
  filtersTimeout = setTimeout(() => {
    applyFilters()
  }, 1000)
}

const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    handleSearch()
  }, 500)
}

const handleSearch = () => {
  console.log('검색 실행:', searchQuery.value)
  if (searchQuery.value.trim()) {
    productsStore.searchProducts({
      search: searchQuery.value.trim(),
      ...filters.value
    })
  } else {
    productsStore.fetchProducts()
  }
}

const resetFilters = () => {
  console.log('필터 초기화')
  filters.value = {
    category: 'all',
    brand: 'all',
    status: 'all',
    inStock: 'all',
    featured: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
  searchQuery.value = ''
  selectedProductIds.value = []
  productsStore.resetFilters()
  productsStore.fetchProducts()
}

const refreshData = async () => {
  console.log('데이터 새로고침')
  try {
    connectionError.value = ''
    await Promise.all([
      productsStore.fetchProducts(),
      productsStore.fetchStats()
    ])
  } catch (error) {
    console.error('데이터 새로고침 실패:', error)
    connectionError.value = getErrorMessage(error)
  }
}

// 페이지네이션
const handlePageChange = (page) => {
  console.log('페이지 변경:', page)
  productsStore.changePage(page - 1)
}

const handlePageSizeChange = (size) => {
  console.log('페이지 크기 변경:', size)
  productsStore.changePageSize(size)
}

// 선택 관련 함수
const toggleAllProducts = (event) => {
  if (event.target.checked) {
    selectedProductIds.value = productsStore.products.map(product => product.id)
  } else {
    selectedProductIds.value = []
  }
}

// 일괄 작업
const bulkToggleStatus = async (isActive) => {
  try {
    console.log('일괄 상태 변경:', selectedProductIds.value, isActive)

    const promises = selectedProductIds.value.map(id =>
        productsStore.updateProduct(id, { isActive })
    )
    await Promise.all(promises)

    selectedProductIds.value = []
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('일괄 상태 변경 실패:', error)
  }
}

const bulkToggleFeatured = async (isFeatured) => {
  try {
    console.log('일괄 추천 설정:', selectedProductIds.value, isFeatured)

    const promises = selectedProductIds.value.map(id =>
        productsStore.updateProduct(id, { isFeatured })
    )
    await Promise.all(promises)

    selectedProductIds.value = []
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('일괄 추천 설정 실패:', error)
  }
}

const bulkDelete = async () => {
  if (confirm(`선택한 ${selectedProductIds.value.length}개의 상품을 삭제하시겠습니까?`)) {
    try {
      console.log('일괄 삭제:', selectedProductIds.value)

      const promises = selectedProductIds.value.map(id =>
          productsStore.deleteProduct(id)
      )
      await Promise.all(promises)

      selectedProductIds.value = []
      await productsStore.fetchProducts()
    } catch (error) {
      console.error('일괄 삭제 실패:', error)
    }
  }
}

// 모달 관리
const closeModal = () => {
  showCreateModal.value = false
  editingProduct.value = null
}

const editProduct = (product) => {
  console.log('상품 수정:', product.id)
  editingProduct.value = product
}

// 상품 생성/수정
const handleSubmit = async (productData) => {
  try {
    console.log('상품 저장:', productData)

    if (editingProduct.value) {
      await productsStore.updateProduct(editingProduct.value.id, productData)
    } else {
      // 새 상품 생성 시 브랜드 ID 필요
      if (!productData.shopId) {
        throw new Error('브랜드를 선택해주세요.')
      }
      await productsStore.createProduct(productData.shopId, productData)
    }
    closeModal()
  } catch (error) {
    console.error('상품 저장 실패:', error)
  }
}

// 상품 상태 토글
const toggleProductStatus = async (product) => {
  try {
    console.log('상품 상태 토글:', product.id)
    await productsStore.toggleProductStatus(product.id)
  } catch (error) {
    console.error('상태 변경 실패:', error)
  }
}

// 상품 추천 토글
const toggleProductFeatured = async (product) => {
  try {
    console.log('상품 추천 토글:', product.id)
    await productsStore.toggleProductFeatured(product.id)
  } catch (error) {
    console.error('추천 설정 변경 실패:', error)
  }
}

// 삭제 관리
const confirmDelete = (product) => {
  console.log('삭제 확인:', product.id)
  deletingProduct.value = product
}

const handleDelete = async () => {
  try {
    console.log('상품 삭제:', deletingProduct.value.id)
    await productsStore.deleteProduct(deletingProduct.value.id)
    deletingProduct.value = null
  } catch (error) {
    console.error('삭제 실패:', error)
  }
}

// SEO 메타데이터
useHead({
  title: '상품 관리 - Shop BackOffice',
  meta: [
    { name: 'description', content: '등록된 상품을 관리하고 상품 정보를 수정할 수 있습니다' }
  ]
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.btn-sm {
  @apply px-2 py-1 text-xs;
}
</style>