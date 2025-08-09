<template>
  <AdminLayout>
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">게시판 관리</h1>
        <button
            @click="showCreateModal = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          게시판 생성
        </button>
      </div>

      <!-- 게시판 목록 -->
      <div class="bg-white shadow overflow-hidden rounded-md">
        <div class="px-4 py-5 sm:p-6" v-if="boardStore.loading">
          <div class="text-center">로딩 중...</div>
        </div>

        <ul class="divide-y divide-gray-200" v-else>
          <li v-for="board in boardStore.boards" :key="board.id" class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ board.title }}</h3>
                <p class="text-sm text-gray-500">{{ board.description }}</p>
                <div class="mt-2 flex items-center space-x-4">
                  <span class="text-xs text-gray-500">
                    게시물: {{ board.postCount }}개
                  </span>
                  <span class="text-xs" :class="board.isActive ? 'text-green-600' : 'text-red-600'">
                    {{ board.isActive ? '공개' : '비공개' }}
                  </span>
                </div>
              </div>

              <NuxtLink
                  :to="`/boards/${board.id}`"
                  class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
              >
                게시물 관리
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>

      <!-- 게시판 생성 모달 -->
      <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3">
            <h3 class="text-lg font-medium text-gray-900 mb-4">새 게시판 생성</h3>

            <form @submit.prevent="handleCreateBoard">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">게시판 제목</label>
                  <input
                      v-model="createForm.title"
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
                  <label class="flex items-center">
                    <input
                        v-model="createForm.allowComments"
                        type="checkbox"
                        class="rounded border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">댓글 허용</span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                        v-model="createForm.allowFiles"
                        type="checkbox"
                        class="rounded border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">파일 업로드 허용</span>
                  </label>
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

const boardStore = useBoardStore()

const showCreateModal = ref(false)
const createForm = reactive({
  title: '',
  description: '',
  allowComments: true,
  allowFiles: false
})

onMounted(() => {
  boardStore.fetchBoards()
})

const handleCreateBoard = async () => {
  try {
    await boardStore.createBoard(createForm)
    showCreateModal.value = false
    // 폼 초기화
    Object.assign(createForm, {
      title: '',
      description: '',
      allowComments: true,
      allowFiles: false
    })
  } catch (error) {
    console.error('게시판 생성 실패:', error)
  }
}
</script>