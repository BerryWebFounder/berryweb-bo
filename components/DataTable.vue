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
            />
          </div>
        </div>

        <div class="flex items-center space-x-2">
          <select
              v-if="filters.length > 0"
              v-model="selectedFilter"
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
              @click="handleSort(column.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <svg
                  v-if="sortKey === column.key"
                  class="w-4 h-4"
                  :class="sortOrder === 'desc' ? 'transform rotate-180' : ''"
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
            로딩 중...
          </td>
        </tr>

        <tr v-else-if="filteredData.length === 0">
          <td :colspan="columns.length + 1" class="px-6 py-4 text-center text-gray-500">
            데이터가 없습니다.
          </td>
        </tr>

        <tr
            v-else
            v-for="(item, index) in paginatedData"
            :key="item.id || index"
            class="hover:bg-gray-50"
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
            >
              {{ formatValue(getNestedValue(item, column.key), column.type) }}
            </slot>
          </td>

          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :item="item" />
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이지네이션 -->
    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-700">
          총 {{ filteredData.length }}개 중
          {{ ((currentPage - 1) * itemsPerPage) + 1 }} -
          {{ Math.min(currentPage * itemsPerPage, filteredData.length) }}개 표시
        </div>

        <div class="flex items-center space-x-2">
          <button
              @click="currentPage = currentPage - 1"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>

          <span class="text-sm text-gray-700">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
              @click="currentPage = currentPage + 1"
              :disabled="currentPage === totalPages"
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
  itemsPerPage: {
    type: Number,
    default: 10
  }
})

const searchQuery = ref('')
const selectedFilter = ref('')
const sortKey = ref('')
const sortOrder = ref('asc')
const currentPage = ref(1)

const filteredData = computed(() => {
  let result = [...props.data]

  // 검색 필터
  if (searchQuery.value) {
    result = result.filter(item => {
      return props.columns.some(column => {
        const value = getNestedValue(item, column.key)
        return String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
      })
    })
  }

  // 추가 필터
  if (selectedFilter.value) {
    result = result.filter(item => {
      return getNestedValue(item, 'status') === selectedFilter.value
    })
  }

  // 정렬
  if (sortKey.value) {
    result.sort((a, b) => {
      const aVal = getNestedValue(a, sortKey.value)
      const bVal = getNestedValue(b, sortKey.value)

      if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / props.itemsPerPage)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredData.value.slice(start, end)
})

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((curr, prop) => curr?.[prop], obj)
}

const formatValue = (value, type) => {
  if (value == null) return '-'

  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString('ko-KR')
    case 'currency':
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(value)
    case 'number':
      return new Intl.NumberFormat('ko-KR').format(value)
    default:
      return value
  }
}

// 검색어나 필터가 변경될 때 첫 페이지로 이동
watch([searchQuery, selectedFilter], () => {
  currentPage.value = 1
})
</script>