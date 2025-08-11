<template>
  <div class="bg-white shadow overflow-hidden rounded-lg">
    <!-- 검색 및 필터 -->
    <div class="px-4 py-3 border-b border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="flex-1 min-w-0">
          <div class="max-w-xs">
            <input
                v-model="searchQuery"
                type="text"
                placeholder="검색..."
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                @input="handleSearch"
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <select
              v-if="filters.length > 0"
              v-model="selectedFilter"
              @change="handleFilterChange"
              class="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="">전체</option>
            <option
                v-for="filter in filters"
                :key="filter.value"
                :value="filter.value"
            >
              {{ filter.label }}
            </option>
          </select>

          <select
              v-model="pageSize"
              @change="handlePageSizeChange"
              class="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="10">10개씩 보기</option>
            <option value="25">25개씩 보기</option>
            <option value="50">50개씩 보기</option>
            <option value="100">100개씩 보기</option>
          </select>

          <slot name="actions" />
        </div>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
              @click="handleSort(column.key, column.sortable !== false)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <svg
                  v-if="sortColumn === column.key && column.sortable !== false"
                  class="w-4 h-4"
                  :class="sortDirection === 'desc' ? 'transform rotate-180' : ''"
                  fill="currentColor"
                  viewBox="0 0 20 20"
              >
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            작업
          </th>
        </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-if="loading" class="animate-pulse">
          <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-gray-500">
            <div class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span class="ml-2">로딩 중...</span>
            </div>
          </td>
        </tr>

        <tr v-else-if="error">
          <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-red-500">
            <div class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {{ error }}
            </div>
          </td>
        </tr>

        <tr v-else-if="!data || data.length === 0">
          <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-gray-500">
            데이터가 없습니다.
          </td>
        </tr>

        <tr
            v-else
            v-for="(item, index) in data"
            :key="item.id || index"
            class="hover:bg-gray-50 transition-colors"
        >
          <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot
                :name="`cell-${column.key}`"
                :item="item"
                :value="getNestedValue(item, column.key)"
                :index="index"
            >
              {{ formatValue(getNestedValue(item, column.key), column.type) }}
            </slot>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item" :index="index" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6" v-if="pagination">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          총 {{ pagination.totalElements?.toLocaleString() || 0 }}개 중
          {{ Math.min((pagination.number * pagination.size) + 1, pagination.totalElements || 0) }} -
          {{ Math.min((pagination.number + 1) * pagination.size, pagination.totalElements || 0) }}개 표시
        </div>

        <div class="flex items-center space-x-2">
          <button
              @click="goToPage(pagination.number - 1)"
              :disabled="pagination.first || loading"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>

          <!-- 페이지 번호들 -->
          <div class="flex items-center space-x-1">
            <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page - 1)"
                :disabled="loading"
                :class="[
                  'px-3 py-1 text-sm font-medium rounded-md',
                  page - 1 === pagination.number
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                ]"
            >
              {{ page }}
            </button>
          </div>

          <button
              @click="goToPage(pagination.number + 1)"
              :disabled="pagination.last || loading"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  filters: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  pagination: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['search', 'filter', 'sort', 'page-change', 'page-size-change'])

const searchQuery = ref('')
const selectedFilter = ref('')
const sortColumn = ref('')
const sortDirection = ref('asc')
const pageSize = ref(10)

let searchTimeout = null

const visiblePages = computed(() => {
  if (!props.pagination) return []

  const totalPages = props.pagination.totalPages
  const currentPage = props.pagination.number + 1 // 0-based to 1-based
  const delta = 2

  let start = Math.max(1, currentPage - delta)
  let end = Math.min(totalPages, currentPage + delta)

  // 페이지 수가 적으면 모두 표시
  if (totalPages <= 5) {
    start = 1
    end = totalPages
  }

  const pages = []
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const handleSearch = () => {
  // 디바운싱 적용
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search', searchQuery.value)
  }, 300)
}

const handleFilterChange = () => {
  emit('filter', selectedFilter.value)
}

const handleSort = (column, sortable = true) => {
  if (!sortable) return

  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }

  emit('sort', {
    column: sortColumn.value,
    direction: sortDirection.value
  })
}

const handlePageSizeChange = () => {
  emit('page-size-change', parseInt(pageSize.value))
}

const goToPage = (page) => {
  if (page < 0 || page >= (props.pagination?.totalPages || 0)) return
  emit('page-change', page)
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj)
}

const formatValue = (value, type) => {
  if (value == null) return '-'

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString('ko-KR')
    case 'datetime':
      return new Date(value).toLocaleString('ko-KR')
    case 'currency':
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(value)
    case 'number':
      return new Intl.NumberFormat('ko-KR').format(value)
    case 'boolean':
      return value ? '예' : '아니요'
    default:
      return value
  }
}

// 컴포넌트 마운트 시 초기값 설정
onMounted(() => {
  if (props.pagination) {
    pageSize.value = props.pagination.size || 10
  }
})
</script>