<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">상품 편집</h1>
          <p class="text-gray-600">{{ product?.name }}</p>
        </div>

        <NuxtLink
            :to="`/shops/${shopId}`"
            class="text-gray-600 hover:text-gray-900"
        >
          ← 돌아가기
        </NuxtLink>
      </div>

      <LoadingSpinner v-if="loading" text="상품 정보를 불러오는 중..." />

      <ErrorMessage
          v-else-if="error"
          type="error"
          title="오류 발생"
          :message="error"
          :retry="true"
          @retry="loadProduct"
      />

      <form v-else @submit.prevent="updateProduct" class="space-y-6">
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
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">카테고리 *</label>
              <select v-model="form.categoryId" required class="form-select">
                <option value="">카테고리 선택</option>
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
              <label class="block text-sm font-medium text-gray-700">상태</label>
              <select v-model="form.status" class="form-select">
                <option value="active">판매중</option>
                <option value="inactive">판매중지</option>
                <option value="draft">임시저장</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">가격 *</label>
              <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  required
                  class="form-input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">재고 수량</label>
              <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  class="form-input"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">상품 설명</label>
              <textarea
                  v-model="form.description"
                  rows="4"
                  class="form-textarea"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 이미지 관리 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">상품 이미지</h2>

          <div v-if="form.images.length > 0" class="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <div
                v-for="(image, index) in form.images"
                :key="image.id"
                class="relative group"
            >
              <img
                  :src="image.url"
                  :alt="`상품 이미지 ${index + 1}`"
                  class="w-full h-32 object-cover rounded-lg"
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

          <FileUpload
              :multiple="true"
              accept="image/*"
              accept-text="이미지 파일만 업로드 가능합니다"
              folder="products"
              @uploaded="handleImageUploaded"
          />
        </div>

        <!-- 상품 옵션 -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">상품 옵션</h2>
            <button
                type="button"
                @click="addOption"
                class="btn btn-success text-sm"
            >
              옵션 추가
            </button>
          </div>

          <div v-if="form.options.length === 0" class="text-gray-500 text-center py-8">
            상품 옵션이 없습니다.
          </div>

          <div v-else class="space-y-4">
            <div
                v-for="(option, index) in form.options"
                :key="`option-${index}`"
                class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-gray-900">옵션 {{ index + 1 }}</h4>
                <button
                    type="button"
                    @click="removeOption(index)"
                    class="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>

              <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700">옵션명</label>
                  <input
                      v-model="option.name"
                      type="text"
                      required
                      class="form-input"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">추가 가격</label>
                  <input
                      v-model.number="option.additionalPrice"
                      type="number"
                      min="0"
                      class="form-input"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">재고</label>
                  <input
                      v-model.number="option.stock"
                      type="number"
                      min="0"
                      class="form-input"
                  />
                </div>
              </div>

              <!-- 옵션 값들 -->
              <div class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-medium text-gray-700">옵션 값</label>
                  <button
                      type="button"
                      @click="addOptionValue(index)"
                      class="text-blue-600 text-sm hover:text-blue-800"
                  >
                    + 값 추가
                  </button>
                </div>

                <div class="space-y-2">
                  <div
                      v-for="(value, valueIndex) in option.values"
                      :key="`value-${valueIndex}`"
                      class="flex items-center space-x-2"
                  >
                    <input
                        v-model="value.name"
                        type="text"
                        placeholder="옵션 값"
                        class="flex-1 form-input"
                    />

                    <button
                        type="button"
                        @click="removeOptionValue(index, valueIndex)"
                        class="text-red-600 hover:text-red-800"
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
        </div>

        <!-- 저장 버튼 -->
        <div class="flex justify-end space-x-3">
          <NuxtLink
              :to="`/shops/${shopId}`"
              class="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            취소
          </NuxtLink>

          <button
              type="submit"
              :disabled="saving"
              class="btn btn-primary disabled:opacity-50"
          >
            {{ saving ? '저장 중...' : '상품 수정' }}
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
const toast = useToast()

const shopId = route.params.shopId
const productId = route.params.id

const productStore = useProductStore()

const product = ref(null)
const categories = ref([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  description: '',
  categoryId: '',
  price: 0,
  stock: 0,
  status: 'active',
  images: [],
  options: []
})

onMounted(async () => {
  await loadProduct()
  await loadCategories()
})

const loadProduct = async () => {
  loading.value = true
  error.value = ''

  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    product.value = await $fetch(`${config.public.apiBase}/admin/shops/${shopId}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    // 폼에 데이터 설정
    Object.assign(form, {
      name: product.value.name,
      description: product.value.description,
      categoryId: product.value.categoryId,
      price: product.value.price,
      stock: product.value.stock,
      status: product.value.status,
      images: product.value.images || [],
      options: product.value.options || []
    })
  } catch (err) {
    error.value = err.message || '상품 정보를 불러오는데 실패했습니다.'
    console.error('상품 로드 실패:', err)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    await productStore.fetchCategories(shopId)
    categories.value = productStore.categories
  } catch (err) {
    console.error('카테고리 로드 실패:', err)
  }
}

const updateProduct = async () => {
  saving.value = true

  try {
    const productData = {
      ...form,
      imageUrls: form.images.map(img => img.url)
    }

    await productStore.updateProduct(shopId, productId, productData)

    toast.success('상품이 성공적으로 수정되었습니다.')
    await router.push(`/shops/${shopId}`)
  } catch (err) {
    toast.error('상품 수정에 실패했습니다.')
    console.error('상품 수정 실패:', err)
  } finally {
    saving.value = false
  }
}

const handleImageUploaded = (image) => {
  form.images.push(image)
}

const removeImage = (index) => {
  form.images.splice(index, 1)
}

const addOption = () => {
  form.options.push({
    name: '',
    additionalPrice: 0,
    stock: 0,
    values: []
  })
}

const removeOption = (index) => {
  form.options.splice(index, 1)
}

const addOptionValue = (optionIndex) => {
  form.options[optionIndex].values.push({
    name: ''
  })
}

const removeOptionValue = (optionIndex, valueIndex) => {
  form.options[optionIndex].values.splice(valueIndex, 1)
}
</script>