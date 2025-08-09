<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- 게시판 정보 헤더 -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ board?.title }}</h1>
            <p class="text-gray-600">{{ board?.description }}</p>
            <div class="mt-2 flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                게시물: {{ posts.length }}개
              </span>
              <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="board?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ board?.isActive ? '공개' : '비공개' }}
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button
                @click="showCreatePostModal = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              공지사항 작성
            </button>

            <button
                @click="showEditModal = true"
                class="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
            >
              게시판 설정
            </button>
          </div>
        </div>
      </div>

      <!-- 게시물 목록 -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <DataTable
              :data="posts"
              :columns="postColumns"
              :filters="postFilters"
              :loading="boardStore.loading"
          >
            <template #cell-type="{ item }">
              <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPostTypeClass(item.type)"
              >
                {{ getPostTypeLabel(item.type) }}
              </span>
            </template>

            <template #cell-status="{ item }">
              <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="item.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
              >
                {{ item.isPublished ? '게시됨' : '임시저장' }}
              </span>
            </template>

            <template #actions="{ item }">
              <div class="flex space-x-2">
                <button
                    @click="editPost(item)"
                    class="text-blue-600 hover:text-blue-900 text-sm"
                >
                  편집
                </button>
                <button
                    @click="viewComments(item)"
                    class="text-green-600 hover:text-green-900 text-sm"
                >
                  댓글 ({{ item.commentCount }})
                </button>
                <button
                    @click="deletePost(item)"
                    class="text-red-600 hover:text-red-900 text-sm"
                >
                  삭제
                </button>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <!-- 게시판 설정 모달 -->
      <Modal v-model:show="showEditModal" title="게시판 설정" size="lg">
        <form @submit.prevent="updateBoard">
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">게시판 제목</label>
                <input
                    v-model="editForm.title"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">상태</label>
                <select
                    v-model="editForm.isActive"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option :value="true">공개</option>
                  <option :value="false">비공개</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">설명</label>
              <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <div class="space-y-4">
              <h4 class="text-sm font-medium text-gray-900">게시판 권한 설정</h4>

              <div class="space-y-2">
                <label class="flex items-center">
                  <input
                      v-model="editForm.allowComments"
                      type="checkbox"
                      class="rounded border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">댓글 허용</span>
                </label>

                <label class="flex items-center">
                  <input
                      v-model="editForm.allowFiles"
                      type="checkbox"
                      class="rounded border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">파일 업로드 허용</span>
                </label>

                <label class="flex items-center">
                  <input
                      v-model="editForm.requireAuth"
                      type="checkbox"
                      class="rounded border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">로그인 사용자만 작성 가능</span>
                </label>
              </div>
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
              @click="updateBoard"
              class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            저장
          </button>
        </template>
      </Modal>

      <!-- 게시물 작성 모달 -->
      <Modal v-model:show="showCreatePostModal" title="게시물 작성" size="xl">
        <form @submit.prevent="createPost">
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">제목</label>
                <input
                    v-model="postForm.title"
                    type="text"
                    required
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">유형</label>
                <select
                    v-model="postForm.type"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="notice">공지사항</option>
                  <option value="faq">FAQ</option>
                  <option value="general">일반 게시물</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">내용</label>
              <textarea
                  v-model="postForm.content"
                  rows="10"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="게시물 내용을 입력하세요"
              ></textarea>
            </div>

            <div v-if="board?.allowFiles">
              <label class="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
              <FileUpload
                  :multiple="true"
                  folder="board-files"
                  @uploaded="handleFileUploaded"
                  @removed="handleFileRemoved"
              />
            </div>

            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input
                    v-model="postForm.isPublished"
                    type="checkbox"
                    class="rounded border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">즉시 게시</span>
              </label>

              <label class="flex items-center">
                <input
                    v-model="postForm.isPinned"
                    type="checkbox"
                    class="rounded border-gray-300"
                />
                <span class="ml-2 text-sm text-gray-700">상단 고정</span>
              </label>
            </div>
          </div>
        </form>

        <template #footer>
          <button
              @click="showCreatePostModal = false"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
              @click="createPost"
              :disabled="saving"
              class="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ saving ? '저장 중...' : '저장' }}
          </button>
        </template>
      </Modal>

      <!-- 댓글 관리 모달 -->
      <Modal v-model:show="showCommentsModal" title="댓글 관리" size="lg">
        <div v-if="selectedPost">
          <h4 class="font-medium text-gray-900 mb-4">{{ selectedPost.title }}</h4>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div
                v-for="comment in comments"
                :key="comment.id"
                class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center space-x-2">
                  <span class="font-medium text-gray-900">{{ comment.authorName }}</span>
                  <span class="text-sm text-gray-500">{{ formatDate(comment.createdAt) }}</span>
                </div>

                <button
                    @click="deleteComment(comment)"
                    class="text-red-600 hover:text-red-800 text-sm"
                >
                  삭제
                </button>
              </div>

              <p class="text-gray-700">{{ comment.content }}</p>
            </div>

            <div v-if="comments.length === 0" class="text-center text-gray-500 py-8">
              댓글이 없습니다.
            </div>
          </div>
        </div>
      </Modal>
    </div>
  </AdminLayout>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const boardId = route.params.id

const boardStore = useBoardStore()

const board = ref(null)
const posts = ref([])
const comments = ref([])
const selectedPost = ref(null)

const showEditModal = ref(false)
const showCreatePostModal = ref(false)
const showCommentsModal = ref(false)
const saving = ref(false)

const editForm = reactive({
  title: '',
  description: '',
  isActive: true,
  allowComments: true,
  allowFiles: false,
  requireAuth: false
})

const postForm = reactive({
  title: '',
  content: '',
  type: 'notice',
  isPublished: true,
  isPinned: false,
  files: []
})

const postColumns = [
  { key: 'type', label: '유형' },
  { key: 'title', label: '제목' },
  { key: 'authorName', label: '작성자' },
  { key: 'viewCount', label: '조회수', type: 'number' },
  { key: 'commentCount', label: '댓글수', type: 'number' },
  { key: 'status', label: '상태' },
  { key: 'createdAt', label: '작성일', type: 'date' }
]

const postFilters = [
  { value: 'notice', label: '공지사항' },
  { value: 'faq', label: 'FAQ' },
  { value: 'general', label: '일반 게시물' }
]

onMounted(async () => {
  await loadBoardData()
  await loadPosts()
})

const loadBoardData = async () => {
  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    board.value = await $fetch(`${config.public.apiBase}/admin/boards/${boardId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    // 편집 폼에 현재 데이터 설정
    Object.assign(editForm, board.value)
  } catch (error) {
    console.error('게시판 데이터 로드 실패:', error)
  }
}

const loadPosts = async () => {
  try {
    await boardStore.fetchPosts(boardId)
    posts.value = boardStore.posts
  } catch (error) {
    console.error('게시물 데이터 로드 실패:', error)
  }
}

const updateBoard = async () => {
  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const updatedBoard = await $fetch(`${config.public.apiBase}/admin/boards/${boardId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: editForm
    })

    board.value = updatedBoard
    showEditModal.value = false
  } catch (error) {
    console.error('게시판 정보 수정 실패:', error)
  }
}

const createPost = async () => {
  saving.value = true

  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    const postData = {
      ...postForm,
      boardId: boardId,
      fileUrls: postForm.files.map(file => file.url)
    }

    await $fetch(`${config.public.apiBase}/admin/boards/${boardId}/posts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authStore.token}`
      },
      body: postData
    })

    await loadPosts()
    showCreatePostModal.value = false

    // 폼 초기화
    Object.assign(postForm, {
      title: '',
      content: '',
      type: 'notice',
      isPublished: true,
      isPinned: false,
      files: []
    })
  } catch (error) {
    console.error('게시물 생성 실패:', error)
  } finally {
    saving.value = false
  }
}

const editPost = (post) => {
  // 게시물 편집 페이지로 이동
  navigateTo(`/boards/${boardId}/posts/${post.id}`)
}

const deletePost = async (post) => {
  if (confirm('게시물을 삭제하시겠습니까?')) {
    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      await $fetch(`${config.public.apiBase}/admin/boards/${boardId}/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })

      await loadPosts()
    } catch (error) {
      console.error('게시물 삭제 실패:', error)
    }
  }
}

const viewComments = async (post) => {
  selectedPost.value = post

  try {
    const config = useRuntimeConfig()
    const authStore = useAuthStore()

    comments.value = await $fetch(`${config.public.apiBase}/admin/posts/${post.id}/comments`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`
      }
    })

    showCommentsModal.value = true
  } catch (error) {
    console.error('댓글 로드 실패:', error)
  }
}

const deleteComment = async (comment) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      const config = useRuntimeConfig()
      const authStore = useAuthStore()

      await $fetch(`${config.public.apiBase}/admin/comments/${comment.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authStore.token}`
        }
      })

      comments.value = comments.value.filter(c => c.id !== comment.id)
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
    }
  }
}

const handleFileUploaded = (file) => {
  postForm.files.push(file)
}

const handleFileRemoved = (file) => {
  postForm.files = postForm.files.filter(f => f.id !== file.id)
}

const getPostTypeClass = (type) => {
  const classes = {
    notice: 'bg-red-100 text-red-800',
    faq: 'bg-blue-100 text-blue-800',
    general: 'bg-gray-100 text-gray-800'
  }
  return classes[type] || classes.general
}

const getPostTypeLabel = (type) => {
  const labels = {
    notice: '공지사항',
    faq: 'FAQ',
    general: '일반'
  }
  return labels[type] || labels.general
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR')
}
</script>