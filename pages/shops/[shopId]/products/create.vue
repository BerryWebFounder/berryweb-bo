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
            class="text-gray-600 hover:text-gray-900"
        >
          ← 돌아가기
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
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">카테고리 *</label>
              <select
                  v-model="form.categoryId"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
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
              <select
                  v-model="form.status"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
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
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">재고 수량</label>
              <input
                  v-model.number="form.stock"
                  type="number"
                  min="0"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">상품 설명</label>
              <textarea
                  v-model="form.description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="상품에 대한 자세한 설명을 입력하세요"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 이미지 업로드 -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">상품 이미지</h2>

          <FileUpload
              :multiple="true"
              accept="image/*"
              accept-text="이미지 파일만 업로드 가능합니다"
              folder="products"
              @uploaded="handleImageUploaded"
              @removed="handleImageRemoved"
          />

          <div v-if="form.images.length > 0" class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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

        <!-- 상품 옵션 -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-medium text-gray-900">상품 옵션</h2>
            <button
                type="button"
                @click="addOption"
                class="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
            >
              옵션 추가
            </button>
          </div>

          <div v-if="form.options.length === 0" class="text-gray-500 text-center py-8">
            상품 옵션이 없습니다. 옵션을 추가해보세요.
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
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="예: 색상, 사이즈"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">추가 가격</label>
                  <input
                      v-model.number="option.additionalPrice"
                      type="number"
                      min="0"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">재고</label>
                  <input
                      v-model.number="option.stock"
                      type="number"
                      min="0"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
const shopId = route.params.shopId

const productStore = useProductStore()

const categories = ref([])
const saving = ref(false)

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
  await loadCategories()
})

const loadCategories = async () => {
  try {
    await productStore.fetchCategories(shopId)
    categories.value = productStore.categories
  } catch (error) {
    console.error('카테고리 로드 실패:', error)
  }
}

const handleImageUploaded = (image) => {
  form.images.push(image)
}

const handleImageRemoved = (image) => {
  form.images = form.images.filter(img => img.id !== image.id)
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

const saveProduct = async () => {
  saving.value = true

  try {
    const productData = {
      ...form,
      imageUrls: form.images.map(img => img.url)
    }

    await productStore.createProduct(shopId, productData)

    // 성공 시 상점 관리 페이지로 이동
    await navigateTo(`/shops/${shopId}`)
  } catch (error) {
    console.error('상품 저장 실패:', error)
  } finally {
    saving.value = false
  }
}
</script>