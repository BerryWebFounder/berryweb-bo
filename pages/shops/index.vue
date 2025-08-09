<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">상점 관리</h1>
        <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          상점 생성
        </button>
      </div>

      <!-- 상점 목록 -->
      <div class="bg-white shadow overflow-hidden rounded-md">
        <div class="px-4 py-5 sm:p-6" v-if="shopStore.loading">
          <div class="text-center">로딩 중...</div>
        </div>

        <ul class="divide-y divide-gray-200" v-else>
          <li v-for="shop in shopStore.shops" :key="shop.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">{{ shop.name }}</h3>
                  <p class="text-sm text-gray-500">{{ shop.description }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="text-xs text-gray-500">
                      생성일: {{ formatDate(shop.createdAt) }}
                    </span>
                    <span class="text-xs" :class="shop.isActive ? 'text-green-600' : 'text-red-600'">
                      {{ shop.isActive ? '활성' : '비활성' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-2">
                <button
                    @click="toggleShopStatus(shop)"
                    :class="shop.isActive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ shop.isActive ? '비활성화' : '활성화' }}
                </button>

                <NuxtLink
                    :to="`/shops/${shop.id}`"
                    class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                >
                  관리
                </NuxtLink>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- 상점 생성 모달 -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">새 상점 생성</h3>

            <form @submit.prevent="handleCreateShop">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">상점명</label>
                  <input
                      v-model="createForm.name"
                      type="text"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">설명</label>
                  <textarea
                      v-model="createForm.description"
                      rows="3"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700">활성 기간 (일)</label>
                  <input
                      v-model="createForm.activeDays"
                      type="number"
                      min="1"
                      required
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div class="flex justify-end space-x-2 mt-6">
                <button
                    type="button"
                    @click="showCreateModal = false"
                    class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                    type="submit"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  생성
                </button>
              </div>
            </form>
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

const showCreateModal = ref(false)
const createForm = reactive({
  name: '',
  description: '',
  activeDays: 30
})

onMounted(() => {
  shopStore.fetchShops()
})

const handleCreateShop = async () => {
  try {
    await shopStore.createShop(createForm)
    showCreateModal.value = false
    // 폼 초기화
    Object.assign(createForm, {
      name: '',
      description: '',
      activeDays: 30
    })
  } catch (error) {
    console.error('상점 생성 실패:', error)
  }
}

const toggleShopStatus = async (shop) => {
  try {
    await shopStore.updateShopStatus(shop.id, !shop.isActive)
  } catch (error) {
    console.error('상점 상태 변경 실패:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}
</script>