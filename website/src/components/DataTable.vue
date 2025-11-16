<template>
  <div class="data-table-container">
    <!-- Search and Filters -->
    <div class="table-controls">
      <div class="search-filter-row">
        <div class="search-box">
          <input
            type="text"
            v-model="localSearch"
            @input="handleSearch"
            :placeholder="searchPlaceholder"
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>
        <div class="filter-actions" v-if="showFilters">
          <slot name="filters"></slot>
        </div>
      </div>
      <div class="sort-controls">
        <select v-model="localSortBy" @change="handleSortChange" class="sort-select">
          <option value="">Sort by...</option>
          <option v-for="col in sortableColumns" :key="col.value" :value="col.value">
            {{ col.label }}
          </option>
        </select>
        <button
          @click="toggleSortOrder"
          class="sort-order-btn"
          :title="localSortOrder === 'asc' ? 'Ascending' : 'Descending'"
        >
          {{ localSortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <slot name="headers"></slot>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td :colspan="columnCount" class="loading-cell">
              <div class="spinner"></div>
              <span>Loading...</span>
            </td>
          </tr>
          <tr v-else-if="data.length === 0">
            <td :colspan="columnCount" class="empty-cell">
              No data found
            </td>
          </tr>
          <slot v-else name="rows" :data="data"></slot>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="pagination && pagination.totalPages > 1">
      <div class="pagination-info">
        Showing {{ ((pagination.page - 1) * pagination.limit) + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
        {{ pagination.total }} entries
      </div>
      <div class="pagination-controls">
        <button
          @click="goToPage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <div class="page-numbers">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['page-btn', { active: page === pagination.page }]"
          >
            {{ page }}
          </button>
        </div>
        <button
          @click="goToPage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  pagination: {
    type: Object,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
  sortableColumns: {
    type: Array,
    default: () => [],
  },
  columnCount: {
    type: Number,
    required: true,
  },
  showFilters: {
    type: Boolean,
    default: false,
  },
  search: {
    type: String,
    default: '',
  },
  sortBy: {
    type: String,
    default: '',
  },
  sortOrder: {
    type: String,
    default: 'desc',
  },
})

const emit = defineEmits(['update:search', 'update:sortBy', 'update:sortOrder', 'page-change'])

const localSearch = ref(props.search)
const localSortBy = ref(props.sortBy)
const localSortOrder = ref(props.sortOrder)

const handleSearch = () => {
  emit('update:search', localSearch.value)
}

const handleSortChange = () => {
  emit('update:sortBy', localSortBy.value)
}

const toggleSortOrder = () => {
  localSortOrder.value = localSortOrder.value === 'asc' ? 'desc' : 'asc'
  emit('update:sortOrder', localSortOrder.value)
}

const goToPage = (page) => {
  if (page >= 1 && page <= props.pagination.totalPages) {
    emit('page-change', page)
  }
}

const visiblePages = computed(() => {
  if (!props.pagination) return []
  const total = props.pagination.totalPages
  const current = props.pagination.page
  const pages = []
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

watch(() => props.search, (newVal) => {
  localSearch.value = newVal
})

watch(() => props.sortBy, (newVal) => {
  localSortBy.value = newVal
})

watch(() => props.sortOrder, (newVal) => {
  localSortOrder.value = newVal
})
</script>

<style scoped>
.data-table-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.table-controls {
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.search-filter-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sort-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sort-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #ffffff;
  cursor: pointer;
}

.sort-order-btn {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.sort-order-btn:hover {
  background: #f3f4f6;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f9fafb;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e5e7eb;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  color: #1f2937;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.loading-cell,
.empty-cell {
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
}

.loading-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.spinner {
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.pagination {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.pagination-info {
  color: #6b7280;
  font-size: 0.9rem;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.pagination-btn,
.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #ffffff;
  color: #1f2937;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled),
.page-btn:hover:not(.active) {
  background: #f3f4f6;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn.active {
  background: #667eea;
  color: #ffffff;
  border-color: #667eea;
}

.page-btn:disabled {
  cursor: default;
}

@media (max-width: 768px) {
  .search-filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .data-table {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem 1rem;
  }
}
</style>

