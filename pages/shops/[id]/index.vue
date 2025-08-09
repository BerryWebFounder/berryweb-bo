<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- 상점 정보 헤더 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ shop?.name }}</h1>
            <p class="text-gray-600">{{ shop?.description }}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                생성일: {{ formatDate(shop?.createdAt) }}
              </span>
              <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="shop?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ shop?.isActive ? '활성' : '비활성' }}
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
                @click="toggleShopStatus"
                :class="shop?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'"
                class="px-4 py-2 text-white rounded-md text-sm font-medium"
            >
              {{ shop?.isActive ? '비활성화' : '활성화' }}
            </button>

            <button
                @click="showEditModal = true"
                class="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              편집
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
                class="py-4 px-1 border-b-2 font-medium text-sm"
                :class="activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            >
              {{ tab.label }}
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

            <DataTable
                :data="products"
                :columns="productColumns"
                :loading="productStore.loading"
            >
              <template #cell-image="{ item }">
                <img
                    v-if="item.imageUrl"
                    :src="item.imageUrl"
                    :alt="item.name"
                    class="w-12 h-12 object-cover rounded"
                />
                <div v-else class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </template>

              <template #cell-status="{ item }">
                <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    :class="item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ item.isActive ? '판매중' : '판매중지' }}
                </span>
              </template>

              <template #actions="{ item }">
                <div class="flex space-x-2">
                  <NuxtLink
                      :to="`/shops/${shopId}/products/${item.id}`"
                      class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    편집
                  </NuxtLink>
                  <button
                      @click="deleteProduct(item)"
                      class="text-red-600 hover:text-red-900 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </template>
            </DataTable>
          </div>

          <!-- 카테고리 관리 탭 -->
          <div v-if="activeTab === 'categories'" class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">카테고리 관리</h3>
              <button
                  @click="showCategoryModal = true"
                  class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                카테고리 추가
              </button>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div
                  v-for="category in categories"
                  :key="category.id"
                  class="bg-gray-50 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-gray-900">{{ category.name }}</h4>
                    <p class="text-sm text-gray-500">상품 {{ category.productCount }}개</p>
                  </div>

                  <div class="flex space-x-1">
                    <button
                        @click="editCategory(category)"
                        class="text-blue-600 hover:text-blue-900"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                        @click="deleteCategory(category)"
                        class="text-red-600 hover:text-red-900"
                    >
                      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 리뷰 관리 탭 -->
          <div v-if="activeTab === 'reviews'" class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900">리뷰 관리</h3>

            <DataTable
                :data="reviews"
                :columns="reviewColumns"
                :loading="productStore.loading"
            >
              <template #cell-rating="{ item }">
                <div class="flex items-center">
                  <div class="flex text-yellow-400">
                    <svg
                        v-for="i in 5"
                        :key="i"
                        class="w-4 h-4"
                        :class="i <= item.rating ? 'text-yellow-400' : 'text-gray-300'"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-1 text-sm text-gray-600">({{ item.rating }})</span>
                </div>
              </template>

              <template #actions="{ item }">
                <div class="flex space-x-2">
                  <button
                      @click="viewReview(item)"
                      class="text-blue-600 hover:text-blue-900 text-sm"
                  >
                    상세
                  </button>
                  <button
                      @click="deleteReview(item)"
                      class="text-red-600 hover:text-red-900 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </template>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- 상점 편집 모달 -->
      <Modal v-model:show="showEditModal" title="상점 정보 편집">
        <form @submit.prevent="updateShop">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">상점명</label>
              <input
                  v-model="editForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">설명</label>
              <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
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
              class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </template>
      </Modal>

      <!-- 카테고리 추가/편집 모달 -->
      <Modal v-model:show="showCategoryModal" title="카테고리 관리">
        <form @submit.prevent="saveCategory">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">카테고리명</label>
              <input
                  v-model="categoryForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">설명</label>
              <textarea
                  v-model="categoryForm.description"
                  rows="2"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>
        </form>

        <template #footer>
          <button
              @click="showCategoryModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
              @click="saveCategory"
              class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            저장
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

const shopStore = useShopStore()
const productStore = useProductStore()

const shop = ref(null)
const products = ref([])
const categories = ref([])
const reviews = ref([])

const activeTab = ref('products')
const showEditModal = ref(false)
const showCategoryModal = ref(false)

const editForm = reactive({
  name: '',
  description: ''
})

const categoryForm = reactive({
  id: null,
  name: '',
  description: ''
})

const tabs = [
  { key: 'products', label: '상품 관리' },
  { key: 'categories', label: '카테고리' },
  { key: 'reviews', label: '리뷰' }
]

const productColumns = [
  { key: 'image', label: '이미지' },
  { key: 'name', label: '상품명' },
  { key: 'price', label: '가격', type: 'currency' },
  { key: 'stock', label: '재고', type: 'number' },
  { key: 'status', label: '상태' },
  { key: 'createdAt', label: '등록일', type: 'date' }
]

const reviewColumns = [
  { key: 'productName', label: '상품명' },
  { key: 'userName', label: '작성자' },
  { key: 'rating', label: '평점' },
  { key: 'content', label: '내용' },
  { key: 'createdAt', label: '작성일', type: 'date' }
]

onMounted(async () => {
  await loadShopData()
  await loadProducts()
  await loadCategories()
  await loadReviews()
})

const loadShopData = async () => {
  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    shop.value = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    // 편집 폼에 현재 데이터 설정
    editForm.name = shop.value.name
    editForm.description = shop.value.description
  } catch (error) {
    console.error('상점 데이터 로드 실패:', error)
  }
}

const loadProducts = async () => {
  try {
    await productStore.fetchProducts(shopId)
    products.value = productStore.products
  } catch (error) {
    console.error('상품 데이터 로드 실패:', error)
  }
}

const loadCategories = async () => {
  try {
    await productStore.fetchCategories(shopId)
    categories.value = productStore.categories
  } catch (error) {
    console.error('카테고리 데이터 로드 실패:', error)
  }
}

const loadReviews = async () => {
  try {
    await productStore.fetchReviews(shopId)
    reviews.value = productStore.reviews
  } catch (error) {
    console.error('리뷰 데이터 로드 실패:', error)
  }
}

const toggleShopStatus = async () => {
  try {
    await shopStore.updateShopStatus(shopId, !shop.value.isActive)
    shop.value.isActive = !shop.value.isActive
  } catch (error) {
    console.error('상점 상태 변경 실패:', error)
  }
}

const updateShop = async () => {
  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const updatedShop = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: editForm
    })

    shop.value = updatedShop
    showEditModal.value = false
  } catch (error) {
    console.error('상점 정보 수정 실패:', error)
  }
}

const saveCategory = async () => {
  try {
    if (categoryForm.id) {
      // 수정
      await productStore.updateCategory(shopId, categoryForm.id, categoryForm)
    } else {
      // 새로 생성
      await productStore.createCategory(shopId, categoryForm)
    }

    await loadCategories()
    showCategoryModal.value = false

    // 폼 초기화
    Object.assign(categoryForm, {
      id: null,
      name: '',
      description: ''
    })
  } catch (error) {
    console.error('카테고리 저장 실패:', error)
  }
}

const editCategory = (category) => {
  Object.assign(categoryForm, category)
  showCategoryModal.value = true
}

const deleteCategory = async (category) => {
  if (confirm('카테고리를 삭제하시겠습니까?')) {
    try {
      await productStore.deleteCategory(shopId, category.id)
      await loadCategories()
    } catch (error) {
      console.error('카테고리 삭제 실패:', error)
    }
  }
}

const deleteProduct = async (product) => {
  if (confirm('상품을 삭제하시겠습니까?')) {
    try {
      await productStore.deleteProduct(shopId, product.id)
      await loadProducts()
    } catch (error) {
      console.error('상품 삭제 실패:', error)
    }
  }
}

const viewReview = (review) => {
  // 리뷰 상세 보기 모달 또는 페이지로 이동
  console.log('리뷰 보기:', review)
}

const deleteReview = async (review) => {
  if (confirm('리뷰를 삭제하시겠습니까?')) {
    try {
      await productStore.deleteReview(shopId, review.id)
      await loadReviews()
    } catch (error) {
      console.error('리뷰 삭제 실패:', error)
    }
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}
</script>