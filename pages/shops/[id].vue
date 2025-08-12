<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- 상점 정보 헤더 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <div class="flex items-center space-x-4">
              <NuxtLink
                  to="/shops"
                  class="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-bold text-gray-900">{{ shop?.name }}</h1>
            </div>
            <p class="text-gray-600 mt-1">{{ shop?.description }}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                생성일: {{ formatDate(shop?.createdAt) }}
              </span>
              <span class="text-sm text-gray-500">
                소유자: {{ shop?.ownerUsername }}
              </span>
              <StatusBadge :status="shop?.isActive ? 'active' : 'inactive'" />
            </div>
          </div>

          <div class="flex space-x-2">
            <button
                @click="toggleShopStatus"
                :disabled="updating"
                :class="shop?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                class="px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50"
            >
              {{ shop?.isActive ? '비활성화' : '활성화' }}
            </button>

            <button
                @click="showEditModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              상점 정보 편집
            </button>
          </div>
        </div>
      </div>

      <!-- 탭 네비게이션 -->
      <div class="bg-white shadow rounded-lg">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8 px-6">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                @click="activeTab = tab.key"
                class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
                :class="activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.label }}
              <span v-if="tab.count !== undefined" class="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>

        <div class="p-6">
          <!-- 상품 관리 탭 -->
          <div v-if="activeTab === 'products'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">상품 관리</h3>
              <NuxtLink
                  :to="`/shops/${shopId}/products/create`"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                상품 추가
              </NuxtLink>
            </div>

            <div class="mb-4 flex items-center space-x-4">
              <SearchInput
                  v-model="productSearchQuery"
                  placeholder="상품명으로 검색..."
                  @update:modelValue="searchProducts"
              />
              <select
                  v-model="productFilter.status"
                  @change="filterProducts"
                  class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">전체 상태</option>
                <option value="ACTIVE">판매중</option>
                <option value="INACTIVE">판매중지</option>
                <option value="OUT_OF_STOCK">품절</option>
              </select>
            </div>

            <LoadingSpinner v-if="productLoading" text="상품 목록을 불러오는 중..." />

            <div v-else-if="products.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">등록된 상품이 없습니다</h4>
              <p class="text-gray-500 mb-6">첫 번째 상품을 등록해보세요!</p>
              <NuxtLink
                  :to="`/shops/${shopId}/products/create`"
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                상품 등록하기
              </NuxtLink>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                  v-for="product in products"
                  :key="product.id"
                  class="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div class="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                      v-if="product.mainImage"
                      :src="getImageUrl(product.mainImage.storedFilename)"
                      :alt="product.name"
                      class="w-full h-48 object-cover"
                  />
                  <div v-else class="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div class="p-4">
                  <div class="flex items-start justify-between">
                    <h4 class="text-sm font-medium text-gray-900 truncate flex-1">{{ product.name }}</h4>
                    <StatusBadge
                        :status="getProductStatus(product.status)"
                        class="ml-2 flex-shrink-0"
                    />
                  </div>

                  <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ product.shortDescription }}</p>

                  <div class="mt-2">
                    <div class="flex items-center justify-between">
                      <div class="text-lg font-bold text-gray-900">
                        {{ formatCurrency(product.salePrice || product.price) }}
                        <span v-if="product.salePrice && product.salePrice !== product.price"
                              class="text-sm text-gray-500 line-through ml-1">
                          {{ formatCurrency(product.price) }}
                        </span>
                      </div>
                      <div class="text-sm text-gray-500">
                        재고: {{ product.stockQuantity || 0 }}개
                      </div>
                    </div>
                  </div>

                  <div class="mt-4 flex space-x-2">
                    <NuxtLink
                        :to="`/shops/${shopId}/products/${product.id}`"
                        class="flex-1 text-center py-2 px-3 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors text-sm"
                    >
                      편집
                    </NuxtLink>
                    <button
                        @click="deleteProduct(product)"
                        class="flex-1 text-center py-2 px-3 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 페이지네이션 -->
            <div v-if="productPagination && productPagination.totalPages > 1" class="flex justify-center mt-6">
              <nav class="flex items-center space-x-2">
                <button
                    @click="loadProducts(productPagination.number - 1)"
                    :disabled="productPagination.first || productLoading"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  이전
                </button>

                <span class="px-3 py-2 text-sm text-gray-700">
                  {{ productPagination.number + 1 }} / {{ productPagination.totalPages }}
                </span>

                <button
                    @click="loadProducts(productPagination.number + 1)"
                    :disabled="productPagination.last || productLoading"
                    class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </nav>
            </div>
          </div>

          <!-- 리뷰 관리 탭 -->
          <div v-if="activeTab === 'reviews'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">리뷰 관리</h3>

            <LoadingSpinner v-if="reviewsLoading" text="리뷰를 불러오는 중..." />

            <div v-else-if="reviews.length === 0" class="text-center py-12">
              <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-900 mb-2">리뷰가 없습니다</h4>
              <p class="text-gray-500">고객들의 리뷰를 기다리고 있습니다.</p>
            </div>

            <div v-else class="space-y-4">
              <div
                  v-for="review in reviews"
                  :key="review.id"
                  class="border border-gray-200 rounded-lg p-4"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                      <span class="font-medium text-gray-900">{{ review.username }}</span>
                      <div class="flex text-yellow-400">
                        <svg
                            v-for="i in 5"
                            :key="i"
                            class="w-4 h-4"
                            :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <span class="text-sm text-gray-500">{{ formatDate(review.createdAt) }}</span>
                    </div>

                    <h5 v-if="review.title" class="font-medium text-gray-900 mb-1">{{ review.title }}</h5>
                    <p class="text-gray-700">{{ review.content }}</p>

                    <div class="mt-2 text-sm text-gray-500">
                      <span>상품: {{ review.productName }}</span>
                      <span v-if="review.isVerifiedPurchase" class="ml-2 text-green-600">✓ 구매확인</span>
                    </div>
                  </div>

                  <div class="ml-4">
                    <button
                        @click="deleteReview(review)"
                        class="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 설정 탭 -->
          <div v-if="activeTab === 'settings'" class="space-y-6">
            <h3 class="text-lg font-medium text-gray-900">상점 설정</h3>

            <div class="bg-gray-50 rounded-lg p-6">
              <h4 class="text-md font-medium text-gray-900 mb-4">기본 정보</h4>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">사업자등록번호</dt>
                  <dd class="text-sm text-gray-900">{{ shop?.businessNumber || '미등록' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">전화번호</dt>
                  <dd class="text-sm text-gray-900">{{ shop?.phone || '미등록' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">이메일</dt>
                  <dd class="text-sm text-gray-900">{{ shop?.email || '미등록' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">주소</dt>
                  <dd class="text-sm text-gray-900">{{ shop?.address || '미등록' }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">최소 주문금액</dt>
                  <dd class="text-sm text-gray-900">{{ formatCurrency(shop?.minOrderAmount || 0) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">배송비</dt>
                  <dd class="text-sm text-gray-900">{{ formatCurrency(shop?.deliveryFee || 0) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">무료배송 금액</dt>
                  <dd class="text-sm text-gray-900">{{ formatCurrency(shop?.freeDeliveryAmount || 0) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">영업시간</dt>
                  <dd class="text-sm text-gray-900">{{ shop?.businessHours || '미설정' }}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- 상점 편집 모달 -->
      <Modal v-model:show="showEditModal" title="상점 정보 편집" size="lg">
        <form @submit.prevent="updateShop">
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">상점명</label>
                <input
                    v-model="editForm.name"
                    type="text"
                    required
                    class="form-input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">사업자등록번호</label>
                <input
                    v-model="editForm.businessNumber"
                    type="text"
                    class="form-input"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">설명</label>
              <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="form-textarea"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">전화번호</label>
                <input
                    v-model="editForm.phone"
                    type="text"
                    class="form-input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">이메일</label>
                <input
                    v-model="editForm.email"
                    type="email"
                    class="form-input"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">주소</label>
              <input
                  v-model="editForm.address"
                  type="text"
                  class="form-input"
              />
            </div>

            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">최소 주문금액</label>
                <input
                    v-model.number="editForm.minOrderAmount"
                    type="number"
                    min="0"
                    class="form-input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">배송비</label>
                <input
                    v-model.number="editForm.deliveryFee"
                    type="number"
                    min="0"
                    class="form-input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">무료배송 금액</label>
                <input
                    v-model.number="editForm.freeDeliveryAmount"
                    type="number"
                    min="0"
                    class="form-input"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">영업시간</label>
              <input
                  v-model="editForm.businessHours"
                  type="text"
                  class="form-input"
              />
            </div>

            <div class="flex items-center">
              <input
                  v-model="editForm.isActive"
                  type="checkbox"
                  id="isActive"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="isActive" class="ml-2 block text-sm text-gray-700">
                상점 활성화
              </label>
            </div>
          </div>
        </form>

        <template #footer>
          <button
              @click="showEditModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
              @click="updateShop"
              :disabled="updating"
              class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ updating ? '저장 중...' : '저장' }}
          </button>
        </template>
      </Modal>
    </div>
  </AdminLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const shopId = route.params.id

const { $api } = useNuxtApp()
const toast = useToast()
const {confirm} = useConfirm()

const shop = ref(null)
const products = ref([])
const reviews = ref([])

const activeTab = ref('products')
const showEditModal = ref(false)
const updating = ref(false)
const reviewsLoading = ref(false)
const productLoading = ref(false)

const productSearchQuery = ref('')
const productFilter = reactive({
  status: ''
})
const productPagination = ref(null)

const editForm = reactive({
  name: '',
  description: '',
  businessNumber: '',
  phone: '',
  email: '',
  address: '',
  minOrderAmount: 0,
  deliveryFee: 0,
  freeDeliveryAmount: 0,
  businessHours: '',
  isActive: true
})

const tabs = computed(() => [
  {key: 'products', label: '상품 관리', count: products.value.length},
  {key: 'reviews', label: '리뷰 관리', count: reviews.value.length},
  {key: 'settings', label: '설정'}
])

onMounted(async () => {
  await loadShopData()
  await loadProducts()
})

const loadShopData = async () => {
  try {
    const response = await $api.get(`/api/v1/shops/${shopId}`)

    if (response.success) {
      shop.value = response.data

      // 편집 폼에 현재 데이터 설정
      Object.assign(editForm, {
        name: shop.value.name,
        description: shop.value.description,
        businessNumber: shop.value.businessNumber,
        phone: shop.value.phone,
        email: shop.value.email,
        address: shop.value.address,
        minOrderAmount: shop.value.minOrderAmount,
        deliveryFee: shop.value.deliveryFee,
        freeDeliveryAmount: shop.value.freeDeliveryAmount,
        businessHours: shop.value.businessHours,
        isActive: shop.value.isActive
      })
    } else {
      toast.error(response.message || '상점 정보를 불러오는데 실패했습니다.')
    }
  } catch (error) {
    toast.error(error.data?.message || error.message || '상점 정보를 불러오는데 실패했습니다.')
    console.error('상점 데이터 로드 실패:', error)
  }
}

const loadProducts = async (page = 0) => {
  productLoading.value = true
  try {
    const params = {
      page,
      size: 12
    }

    if (productSearchQuery.value) {
      params.search = productSearchQuery.value
    }

    if (productFilter.status) {
      params.status = productFilter.status
    }

    const response = await $api.get(`/api/v1/shops/${shopId}/products`, { params })

    if (response.success) {
      if (response.data.content) {
        products.value = response.data.content
        productPagination.value = {
          number: response.data.number,
          size: response.data.size,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          first: response.data.first,
          last: response.data.last
        }
      } else {
        products.value = response.data
        productPagination.value = null
      }
    } else {
      toast.error(response.message || '상품 목록을 불러오는데 실패했습니다.')
    }
  } catch (error) {
    toast.error(error.data?.message || error.message || '상품 목록을 불러오는데 실패했습니다.')
    console.error('상품 목록 로드 실패:', error)
  } finally {
    productLoading.value = false
  }
}

const loadReviews = async () => {
  reviewsLoading.value = true
  try {
    const allReviews = []

    // 모든 상품의 리뷰를 가져옴
    for (const product of products.value) {
      try {
        const response = await $api.get(`/api/v1/products/${product.id}/reviews`, {
          params: { page: 0, size: 100 }
        })

        if (response.success) {
          if (response.data.content) {
            allReviews.push(...response.data.content)
          } else if (Array.isArray(response.data)) {
            allReviews.push(...response.data)
          }
        }
      } catch (error) {
        console.error(`상품 ${product.id}의 리뷰 로드 실패:`, error)
      }
    }

    reviews.value = allReviews
  } catch (error) {
    toast.error(error.data?.message || error.message || '리뷰 목록을 불러오는데 실패했습니다.')
    console.error('리뷰 목록 로드 실패:', error)
  } finally {
    reviewsLoading.value = false
  }
}

const toggleShopStatus = async () => {
  const confirmed = await confirm({
    title: shop.value.isActive ? '상점 비활성화' : '상점 활성화',
    message: `"${shop.value.name}" 상점을 ${shop.value.isActive ? '비활성화' : '활성화'}하시겠습니까?`,
    confirmText: shop.value.isActive ? '비활성화' : '활성화',
    cancelText: '취소'
  })

  if (confirmed) {
    updating.value = true
    try {
      const updateData = {
        ...shop.value,
        isActive: !shop.value.isActive
      }

      const response = await $api.put(`/api/v1/shops/${shopId}`, updateData)

      if (response.success) {
        shop.value = response.data
        toast.success(`상점이 ${response.data.isActive ? '활성화' : '비활성화'}되었습니다.`)
      } else {
        toast.error(response.message || '상점 상태 변경에 실패했습니다.')
      }
    } catch (error) {
      toast.error(error.data?.message || error.message || '상점 상태 변경에 실패했습니다.')
      console.error('상점 상태 변경 실패:', error)
    } finally {
      updating.value = false
    }
  }
}

const updateShop = async () => {
  if (!editForm.name.trim()) {
    toast.error('상점명을 입력해주세요.')
    return
  }

  updating.value = true
  try {
    const response = await $api.put(`/api/v1/shops/${shopId}`, editForm)

    if (response.success) {
      shop.value = response.data
      showEditModal.value = false
      toast.success('상점 정보가 성공적으로 수정되었습니다.')
    } else {
      toast.error(response.message || '상점 정보 수정에 실패했습니다.')
    }
  } catch (error) {
    toast.error(error.data?.message || error.message || '상점 정보 수정에 실패했습니다.')
    console.error('상점 정보 수정 실패:', error)
  } finally {
    updating.value = false
  }
}

const deleteProduct = async (product) => {
  const confirmed = await confirm({
    title: '상품 삭제',
    message: `"${product.name}" 상품을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
    confirmText: '삭제',
    cancelText: '취소'
  })

  if (confirmed) {
    try {
      // 상품 삭제 API 호출 (PUT으로 상태 변경)
      const response = await $api.put(`/api/v1/shops/${shopId}/products/${product.id}`, {
        ...product,
        status: 'DISCONTINUED'
      })

      if (response.success) {
        await loadProducts()
        toast.success('상품이 삭제되었습니다.')
      } else {
        toast.error(response.message || '상품 삭제에 실패했습니다.')
      }
    } catch (error) {
      toast.error(error.data?.message || error.message || '상품 삭제에 실패했습니다.')
      console.error('상품 삭제 실패:', error)
    }
  }
}

const deleteReview = async (review) => {
  const confirmed = await confirm({
    title: '리뷰 삭제',
    message: '이 리뷰를 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '취소'
  })

  if (confirmed) {
    try {
      const response = await $api.delete(`/api/v1/products/${review.productId}/reviews/${review.id}`)

      if (response.success) {
        await loadReviews()
        toast.success('리뷰가 삭제되었습니다.')
      } else {
        toast.error(response.message || '리뷰 삭제에 실패했습니다.')
      }
    } catch (error) {
      toast.error(error.data?.message || error.message || '리뷰 삭제에 실패했습니다.')
      console.error('리뷰 삭제 실패:', error)
    }
  }
}

const searchProducts = debounce(async () => {
  await loadProducts(0)
}, 500)

const filterProducts = async () => {
  await loadProducts(0)
}

const getImageUrl = (filename) => {
  const config = useRuntimeConfig()
  return `${config.public.apiBase}/files/${filename}`
}

const getProductStatus = (status) => {
  const statusMap = {
    'ACTIVE': 'active',
    'INACTIVE': 'inactive',
    'OUT_OF_STOCK': 'pending',
    'DISCONTINUED': 'draft'
  }
  return statusMap[status] || 'inactive'
}

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

// 탭 변경시 데이터 로드
watch(activeTab, async (newTab) => {
  if (newTab === 'reviews' && reviews.value.length === 0) {
    await loadReviews()
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.form-input {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}

.form-textarea {
  @apply mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500;
}
</style>