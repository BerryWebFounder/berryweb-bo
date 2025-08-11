<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">상품 추가</h1>
          <p class="text-gray-600">새로운 상품을 등록하세요</p>
        </div>

        <NuxtLink
            :to="`/shops/${shopId}`"
            class="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          돌아가기
        </NuxtLink>
      </div>

      <form @submit.prevent="saveProduct" class="space-y-6">
        <!-- 기본 정보 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">기본 정보</h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">상품명 *</label>
              <input
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="상품명을 입력하세요"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">카테고리</label>
              <select v-model="form.categoryId" class="form-select">
                <option value="">카테고리 선택 (선택사항)</option>
                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">상품 상태</label>
              <select v-model="form.status" class="form-select">
                <option value="ACTIVE">판매중</option>
                <option value="INACTIVE">판매중지</option>
                <option value="OUT_OF_STOCK">품절</option>
                <option value="DISCONTINUED">단종</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">판매가격 *</label>
              <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  step="100"
                  required
                  placeholder="0"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">할인가격</label>
              <input
                  v-model.number="form.salePrice"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="할인가격 (선택사항)"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">원가</label>
              <input
                  v-model.number="form.costPrice"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="원가 (선택사항)"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">재고 수량</label>
              <input
                  v-model.number="form.stockQuantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">최소 재고 알림</label>
              <input
                  v-model.number="form.minStockQuantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">최대 주문 수량</label>
              <input
                  v-model.number="form.maxOrderQuantity"
                  type="number"
                  min="1"
                  placeholder="제한 없음"
                  class="form-input"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">간단 설명</label>
              <textarea
                  v-model="form.shortDescription"
                  rows="2"
                  placeholder="상품의 간단한 설명을 입력하세요"
                  class="form-textarea"
              ></textarea>
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">상세 설명</label>
              <textarea
                  v-model="form.description"
                  rows="6"
                  placeholder="상품에 대한 자세한 설명을 입력하세요"
                  class="form-textarea"
              ></textarea>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div class="flex items-center">
              <input
                  v-model="form.trackStock"
                  type="checkbox"
                  id="trackStock"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="trackStock" class="ml-2 block text-sm text-gray-700">
                재고 추적
              </label>
            </div>

            <div class="flex items-center">
              <input
                  v-model="form.isFeatured"
                  type="checkbox"
                  id="isFeatured"
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label for="isFeatured" class="ml-2 block text-sm text-gray-700">
                추천 상품
              </label>
            </div>
          </div>
        </div>

        <!-- SEO 및 추가 정보 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">SEO 및 추가 정보</h2>

          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">슬러그 (URL)</label>
              <input
                  v-model="form.slug"
                  type="text"
                  placeholder="product-slug (선택사항)"
                  class="form-input"
              />
              <p class="mt-1 text-xs text-gray-500">영문, 숫자, 하이픈만 사용 가능</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">무게 (kg)</label>
              <input
                  v-model.number="form.weight"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="0.0"
                  class="form-input"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">크기 (가로x세로x높이)</label>
              <input
                  v-model="form.dimensions"
                  type="text"
                  placeholder="예: 10x15x5 (cm)"
                  class="form-input"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">메타 제목</label>
              <input
                  v-model="form.metaTitle"
                  type="text"
                  placeholder="검색엔진에 표시될 제목"
                  class="form-input"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">메타 설명</label>
              <textarea
                  v-model="form.metaDescription"
                  rows="2"
                  placeholder="검색엔진에 표시될 설명"
                  class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 이미지 업로드 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">상품 이미지</h2>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">이미지 선택</label>
              <input
                  ref="fileInput"
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImageSelect"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p class="mt-1 text-xs text-gray-500">
                JPG, PNG, GIF 형식만 지원됩니다. 최대 10개까지 업로드 가능합니다.
              </p>
            </div>

            <!-- 선택된 이미지 미리보기 -->
            <div v-if="selectedImages.length > 0" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <div
                  v-for="(image, index) in selectedImages"
                  :key="index"
                  class="relative group"
              >
                <img
                    :src="image.preview"
                    :alt="`상품 이미지 ${index + 1}`"
                    class="w-full h-32 object-cover rounded-lg border"
                />

                <button
                    type="button"
                    @click="removeImage(index)"
                    class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div
                    v-if="index === 0"
                    class="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded"
                >
                  대표 이미지
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 저장 버튼 -->
        <div class="flex justify-end space-x-3">
          <NuxtLink
              :to="`/shops/${shopId}`"
              class="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
          >
            취소
          </NuxtLink>

          <button
              type="submit"
              :disabled="saving"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? '저장 중...' : '상품 저장' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const shopId = route.params.shopId

const productStore = useProductStore()
const categoryStore = useCategoryStore()
const toast = useToast()

const categories = ref([])
const saving = ref(false)
const selectedImages = ref([])

const form = reactive({
  name: '',
  description: '',
  shortDescription: '',
  categoryId: null,
  price: 0,
  salePrice: null,
  costPrice: null,
  stockQuantity: 0,
  minStockQuantity: 0,
  maxOrderQuantity: null,
  trackStock: true,
  isFeatured: false,
  slug: '',
  metaTitle: '',
  metaDescription: '',
  weight: null,
  dimensions: ''
})

onMounted(async () => {
  await loadCategories()
})

const loadCategories = async () => {
  try {
    // 카테고리 API가 있다면 로드, 없다면 빈 배열로 유지
    // categories.value = await categoryStore.fetchCategories(shopId)
    categories.value = []
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
    categories.value = []
  }
}

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files)

  if (files.length + selectedImages.value.length > 10) {
    toast.error('최대 10개의 이미지만 업로드할 수 있습니다.')
    return
  }

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })

  // 파일 input 초기화
  event.target.value = ''
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

const saveProduct = async () => {
  if (!form.name.trim()) {
    toast.error('상품명을 입력해주세요.')
    return
  }

  if (form.price <= 0) {
    toast.error('올바른 가격을 입력해주세요.')
    return
  }

  saving.value = true

  try {
    // 이미지 파일들 준비
    const imageFiles = selectedImages.value.map(img => img.file)

    const productData = {
      shopId: parseInt(shopId),
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      price: form.price,
      salePrice: form.salePrice,
      costPrice: form.costPrice,
      stockQuantity: form.stockQuantity,
      minStockQuantity: form.minStockQuantity,
      maxOrderQuantity: form.maxOrderQuantity,
      trackStock: form.trackStock,
      isFeatured: form.isFeatured,
      slug: form.slug || null,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      weight: form.weight,
      dimensions: form.dimensions || null
    }

    await productStore.createProduct(shopId, productData, imageFiles)

    toast.success('상품이 성공적으로 등록되었습니다.')
    await router.push(`/shops/${shopId}`)

  } catch (error) {
    toast.error(error.message || '상품 등록에 실패했습니다.')
    console.error('상품 저장 실패:', error)
  } finally {
    saving.value = false
  }
}

// 상품명 입력시 슬러그 자동 생성
watch(() => form.name, (newName) => {
  if (newName && !form.slug) {
    form.slug = generateSlug(newName)
  }
})

const generateSlug = (text) => {
  return text
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
}
</script>