<template>
  <div class="space-y-8">
    <!-- 헤더 영역 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">리뷰 관리</h2>
        <p class="mt-2 text-gray-600">고객 리뷰를 관리하고 승인/거부 처리할 수 있습니다</p>
      </div>
      <div class="mt-4 sm:mt-0 flex items-center space-x-3">
        <button
            @click="showBulkModal = true"
            class="btn-secondary"
            :disabled="selectedReviewIds.length === 0"
        >
          <Icon name="settings" size="sm" class="mr-2" />
          일괄 처리 ({{ selectedReviewIds.length }})
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
            <h3 class="text-lg font-semibold text-gray-900">리뷰 API 서버 연결 실패</h3>
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
      <!-- 전체 리뷰 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">전체 리뷰</p>
            <p class="text-3xl font-bold text-gray-900">
              {{ formatNumber(reviewsStore.stats.totalReviews) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="comment" size="lg" color="blue" />
          </div>
        </div>
      </div>

      <!-- 승인 대기 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">승인 대기</p>
            <p class="text-3xl font-bold text-yellow-600">
              {{ formatNumber(reviewsStore.stats.pendingReviews) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              승인됨: {{ formatNumber(reviewsStore.stats.approvedReviews) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Icon name="notification" size="lg" color="yellow" />
          </div>
        </div>
      </div>

      <!-- 평균 평점 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">평균 평점</p>
            <p class="text-3xl font-bold text-purple-600 flex items-center">
              {{ reviewsStore.stats.averageRating.toFixed(1) }}
              <span class="text-yellow-400 ml-1">⭐</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">
              인증됨: {{ formatNumber(reviewsStore.stats.verifiedReviews) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="analytics" size="lg" color="purple" />
          </div>
        </div>
      </div>

      <!-- 이번 달 리뷰 -->
      <div class="card p-6">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">이번 달 리뷰</p>
            <p class="text-3xl font-bold text-green-600">
              {{ formatNumber(reviewsStore.stats.reviewsThisMonth) }}
            </p>
            <p class="text-sm text-gray-500 mt-1">
              이미지 있음: {{ formatNumber(reviewsStore.stats.reviewsWithImages) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="upload" size="lg" color="green" />
          </div>
        </div>
      </div>
    </div>

    <!-- 필터 및 검색 영역 -->
    <div class="card p-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        <!-- 평점 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">평점</label>
          <select v-model="filters.rating" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="5">⭐⭐⭐⭐⭐ (5점)</option>
            <option value="4">⭐⭐⭐⭐ (4점)</option>
            <option value="3">⭐⭐⭐ (3점)</option>
            <option value="2">⭐⭐ (2점)</option>
            <option value="1">⭐ (1점)</option>
          </select>
        </div>

        <!-- 상태 필터 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">상태</label>
          <select v-model="filters.status" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="pending">승인 대기</option>
            <option value="approved">승인됨</option>
            <option value="rejected">거부됨</option>
          </select>
        </div>

        <!-- 인증 여부 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">인증</label>
          <select v-model="filters.verified" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="true">인증됨</option>
            <option value="false">미인증</option>
          </select>
        </div>

        <!-- 이미지 여부 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">이미지</label>
          <select v-model="filters.hasImages" class="form-select" @change="applyFilters">
            <option value="all">전체</option>
            <option value="true">이미지 있음</option>
            <option value="false">이미지 없음</option>
          </select>
        </div>

        <!-- 정렬 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">정렬</label>
          <select v-model="filters.sortBy" class="form-select" @change="applyFilters">
            <option value="createdAt">작성일</option>
            <option value="rating">평점</option>
            <option value="userName">사용자명</option>
            <option value="productName">상품명</option>
          </select>
        </div>
      </div>

      <!-- 키워드 검색 -->
      <div class="flex items-center space-x-4">
        <div class="relative flex-1">
          <input
              v-model="searchQuery"
              type="text"
              placeholder="리뷰 내용, 상품명, 사용자명으로 검색..."
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
            :disabled="reviewsStore.loading"
        >
          <Icon
              name="analytics"
              size="sm"
              :class="{ 'animate-spin': reviewsStore.loading }"
          />
        </button>
      </div>
    </div>

    <!-- 일괄 선택 액션 -->
    <div v-if="selectedReviewIds.length > 0" class="card p-4 border-l-4 border-l-blue-500">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <span class="text-sm font-medium text-gray-900">{{ selectedReviewIds.length }}개 리뷰 선택됨</span>
          <div class="flex items-center space-x-2">
            <button
                @click="bulkApprove"
                class="btn-success btn-sm"
            >
              승인
            </button>
            <button
                @click="bulkReject"
                class="btn-warning btn-sm"
            >
              거부
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
            @click="selectedReviewIds = []"
            class="text-gray-400 hover:text-gray-600"
        >
          <Icon name="close" size="sm" />
        </button>
      </div>
    </div>

    <!-- 리뷰 목록 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="table">
          <thead class="table-header">
          <tr>
            <th class="table-header-cell w-12">
              <input
                  type="checkbox"
                  :checked="selectedReviewIds.length === reviewsStore.reviews.length && reviewsStore.reviews.length > 0"
                  @change="toggleAllReviews"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </th>
            <th class="table-header-cell">리뷰 정보</th>
            <th class="table-header-cell">상품 정보</th>
            <th class="table-header-cell">평점</th>
            <th class="table-header-cell">상태</th>
            <th class="table-header-cell">작성일</th>
            <th class="table-header-cell">관리</th>
          </tr>
          </thead>
          <tbody class="table-body">
          <tr
              v-for="review in reviewsStore.reviews"
              :key="review.id"
              class="hover:bg-gray-50"
              :class="{ 'bg-blue-50': selectedReviewIds.includes(review.id) }"
          >
            <!-- 선택 체크박스 -->
            <td class="table-cell">
              <input
                  type="checkbox"
                  :value="review.id"
                  v-model="selectedReviewIds"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              >
            </td>

            <!-- 리뷰 정보 -->
            <td class="table-cell">
              <div class="space-y-2">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {{ getUserInitials(review.userName) }}
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ review.userName }}</div>
                    <div v-if="review.isVerified" class="text-xs text-green-600 flex items-center">
                      <Icon name="plus" size="xs" class="mr-1" />
                      인증된 구매
                    </div>
                  </div>
                </div>
                <div class="text-sm text-gray-700">
                  <div v-if="review.title" class="font-medium mb-1">{{ review.title }}</div>
                  <div class="line-clamp-3">{{ review.content }}</div>
                </div>
                <div v-if="review.images && review.images.length > 0" class="flex items-center space-x-1">
                  <Icon name="upload" size="sm" color="blue" />
                  <span class="text-xs text-blue-600">이미지 {{ review.images.length }}장</span>
                </div>
              </div>
            </td>

            <!-- 상품 정보 -->
            <td class="table-cell">
              <div>
                <div class="font-medium text-gray-900">{{ review.productName }}</div>
                <div class="text-sm text-gray-500">ID: {{ review.productId }}</div>
              </div>
            </td>

            <!-- 평점 -->
            <td class="table-cell">
              <div class="flex items-center space-x-1">
                <div class="flex">
                  <span
                      v-for="i in 5"
                      :key="i"
                      :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                  >
                    ⭐
                  </span>
                </div>
                <span class="text-sm font-medium">{{ review.rating }}/5</span>
              </div>
            </td>

            <!-- 상태 -->
            <td class="table-cell">
              <div class="space-y-1">
                <Badge
                    :variant="getStatusVariant(review.status)"
                    :text="getStatusDisplayName(review.status)"
                    size="sm"
                />
              </div>
            </td>

            <!-- 작성일 -->
            <td class="table-cell text-gray-500">
              <div class="text-sm">{{ formatDate(review.createdAt) }}</div>
              <div class="text-xs">{{ formatTime(review.createdAt) }}</div>
            </td>

            <!-- 관리 -->
            <td class="table-cell">
              <div class="flex items-center space-x-2">
                <!-- 상세 보기 -->
                <NuxtLink
                    :to="`/reviews/${review.id}`"
                    class="text-blue-600 hover:text-blue-700"
                    title="상세 보기"
                >
                  <Icon name="eye" size="sm" />
                </NuxtLink>

                <!-- 승인 -->
                <button
                    v-if="review.status === 'pending'"
                    @click="approveReview(review)"
                    class="text-green-600 hover:text-green-700"
                    title="승인"
                >
                  <Icon name="plus" size="sm" />
                </button>

                <!-- 거부 -->
                <button
                    v-if="review.status === 'pending'"
                    @click="rejectReview(review)"
                    class="text-yellow-600 hover:text-yellow-700"
                    title="거부"
                >
                  <Icon name="close" size="sm" />
                </button>

                <!-- 상태 변경 -->
                <select
                    :value="review.status"
                    @change="updateReviewStatus(review, $event.target.value)"
                    class="text-xs border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                    title="상태 변경"
                >
                  <option value="pending">대기</option>
                  <option value="approved">승인</option>
                  <option value="rejected">거부</option>
                </select>

                <!-- 삭제 -->
                <button
                    @click="confirmDelete(review)"
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
        <div v-if="reviewsStore.reviews.length === 0 && !reviewsStore.loading" class="text-center py-12">
          <Icon name="comment" size="xl" color="gray" class="mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">등록된 리뷰가 없습니다</h3>
          <p class="text-gray-500">고객이 상품에 대한 리뷰를 작성하면 여기에 표시됩니다.</p>
        </div>

        <!-- 로딩 상태 -->
        <div v-if="reviewsStore.loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p class="text-gray-500">데이터를 불러오는 중...</p>
        </div>
      </div>

      <!-- 페이지네이션 -->
      <Pagination
          v-if="reviewsStore.pagination.totalPages > 1"
          :current-page="reviewsStore.pagination.page + 1"
          :page-size="reviewsStore.pagination.size"
          :total="reviewsStore.pagination.totalElements"
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
      />
    </div>

    <!-- 삭제 확인 모달 -->
    <DeleteConfirmModal
        v-if="deletingReview"
        :title="`리뷰 삭제`"
        :message="`선택한 리뷰를 삭제하시겠습니까?`"
        :show-warning="true"
        :warning-message="'삭제된 리뷰는 복구할 수 없습니다.'"
        @confirm="handleDelete"
        @cancel="deletingReview = null"
    />
  </div>
</template>

<script setup>
// 인증 미들웨어 적용 (운영자 이상)
definePageMeta({
  middleware: ['auth', 'moderator-auth']
})

const reviewsStore = useReviewsStore()
const authStore = useAuthStore()

// 반응형 데이터
const searchQuery = ref('')
const showBulkModal = ref(false)
const deletingReview = ref(null)
const selectedReviewIds = ref([])
const connectionError = ref('')

// 필터 상태
const filters = ref({
  rating: 'all',
  status: 'all',
  verified: 'all',
  hasImages: 'all',
  startDate: '',
  endDate: '',
  sortBy: 'createdAt',
  sortOrder: 'desc'
})

// 디바운스 타이머
let searchTimeout = null

// 페이지 로드 시 데이터 초기화
onMounted(async () => {
  console.log('리뷰 관리 페이지 마운트됨')
  await initializeData()
})

// 데이터 초기화
const initializeData = async () => {
  try {
    console.log('리뷰 데이터 초기화 시작')
    connectionError.value = ''
    await reviewsStore.initialize()
    console.log('리뷰 데이터 초기화 완료')
  } catch (error) {
    console.error('리뷰 데이터 초기화 실패:', error)
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
      return '리뷰 API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
    }
    return error.message
  }
  return '알 수 없는 오류가 발생했습니다.'
}

// 유틸리티 함수들
const formatNumber = (num) => {
  return new Intl.NumberFormat('ko-KR').format(num || 0)
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

const getUserInitials = (userName) => {
  if (!userName) return '?'
  return userName.charAt(0).toUpperCase()
}

const getStatusVariant = (status) => {
  const variants = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return variants[status] || 'gray'
}

const getStatusDisplayName = (status) => {
  const names = {
    pending: '승인 대기',
    approved: '승인됨',
    rejected: '거부됨'
  }
  return names[status] || status
}

// 검색 및 필터링
const applyFilters = () => {
  console.log('필터 적용:', filters.value)
  reviewsStore.updateFilters(filters.value)
  reviewsStore.fetchReviews()
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
    reviewsStore.searchReviews({
      search: searchQuery.value.trim(),
      ...filters.value
    })
  } else {
    reviewsStore.fetchReviews()
  }
}

const resetFilters = () => {
  console.log('필터 초기화')
  filters.value = {
    rating: 'all',
    status: 'all',
    verified: 'all',
    hasImages: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
  searchQuery.value = ''
  selectedReviewIds.value = []
  reviewsStore.resetFilters()
  reviewsStore.fetchReviews()
}

const refreshData = async () => {
  console.log('데이터 새로고침')
  try {
    connectionError.value = ''
    await Promise.all([
      reviewsStore.fetchReviews(),
      reviewsStore.fetchStats()
    ])
  } catch (error) {
    console.error('데이터 새로고침 실패:', error)
    connectionError.value = getErrorMessage(error)
  }
}

// 페이지네이션
const handlePageChange = (page) => {
  console.log('페이지 변경:', page)
  reviewsStore.changePage(page - 1)
}

const handlePageSizeChange = (size) => {
  console.log('페이지 크기 변경:', size)
  reviewsStore.changePageSize(size)
}

// 선택 관련 함수
const toggleAllReviews = (event) => {
  if (event.target.checked) {
    selectedReviewIds.value = reviewsStore.reviews.map(review => review.id)
  } else {
    selectedReviewIds.value = []
  }
}

// 리뷰 상태 관리
const approveReview = async (review) => {
  try {
    console.log('리뷰 승인:', review.id)
    await reviewsStore.updateReviewStatus(review.id, 'approved')
  } catch (error) {
    console.error('리뷰 승인 실패:', error)
  }
}

const rejectReview = async (review) => {
  try {
    console.log('리뷰 거부:', review.id)
    await reviewsStore.updateReviewStatus(review.id, 'rejected')
  } catch (error) {
    console.error('리뷰 거부 실패:', error)
  }
}

const updateReviewStatus = async (review, newStatus) => {
  if (review.status === newStatus) return

  try {
    console.log('리뷰 상태 변경:', review.id, newStatus)
    await reviewsStore.updateReviewStatus(review.id, newStatus)
  } catch (error) {
    console.error('리뷰 상태 변경 실패:', error)
  }
}

// 일괄 작업
const bulkApprove = async () => {
  try {
    console.log('리뷰 일괄 승인:', selectedReviewIds.value)
    await reviewsStore.bulkApproveReviews(selectedReviewIds.value)
    selectedReviewIds.value = []
  } catch (error) {
    console.error('일괄 승인 실패:', error)
  }
}

const bulkReject = async () => {
  try {
    console.log('리뷰 일괄 거부:', selectedReviewIds.value)
    await reviewsStore.bulkRejectReviews(selectedReviewIds.value)
    selectedReviewIds.value = []
  } catch (error) {
    console.error('일괄 거부 실패:', error)
  }
}

const bulkDelete = async () => {
  if (confirm(`선택한 ${selectedReviewIds.value.length}개의 리뷰를 삭제하시겠습니까?`)) {
    try {
      console.log('리뷰 일괄 삭제:', selectedReviewIds.value)
      await reviewsStore.bulkDeleteReviews(selectedReviewIds.value)
      selectedReviewIds.value = []
    } catch (error) {
      console.error('일괄 삭제 실패:', error)
    }
  }
}

// 삭제 관리
const confirmDelete = (review) => {
  console.log('삭제 확인:', review.id)
  deletingReview.value = review
}

const handleDelete = async () => {
  try {
    console.log('리뷰 삭제:', deletingReview.value.id)
    await reviewsStore.deleteReview(deletingReview.value.productId, deletingReview.value.id)
    deletingReview.value = null
  } catch (error) {
    console.error('삭제 실패:', error)
  }
}

// SEO 메타데이터
useHead({
  title: '리뷰 관리 - Shop BackOffice',
  meta: [
    { name: 'description', content: '고객 리뷰를 관리하고 승인/거부 처리할 수 있습니다' }
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>