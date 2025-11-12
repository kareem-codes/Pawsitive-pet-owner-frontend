'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Filter,
  X,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { useI18n } from './Providers'

export interface FilterOption {
  id: string
  label: string
  value: any
  type: 'select' | 'multiselect' | 'date-range' | 'text'
  options?: { value: string; label: string }[]
}

export interface SortOption {
  field: string
  direction: 'asc' | 'desc'
}

interface AdvancedFilterProps {
  filters: FilterOption[]
  sortOptions: { field: string; label: string }[]
  onFilterChange: (filters: Record<string, any>) => void
  onSortChange: (sort: SortOption) => void
  currentSort?: SortOption
}

export default function AdvancedFilter({
  filters,
  sortOptions,
  onFilterChange,
  onSortChange,
  currentSort,
}: AdvancedFilterProps) {
  const { t, lang } = useI18n()
  const isRTL = lang === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const [filterValues, setFilterValues] = useState<Record<string, any>>({})
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleFilterChange = (filterId: string, value: any) => {
    const newFilters = { ...filterValues, [filterId]: value }
    setFilterValues(newFilters)
    
    // Count active filters
    const activeCount = Object.values(newFilters).filter(v => 
      v !== '' && v !== null && v !== undefined && (!Array.isArray(v) || v.length > 0)
    ).length
    setActiveFiltersCount(activeCount)
    
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    setFilterValues({})
    setActiveFiltersCount(0)
    onFilterChange({})
  }

  const handleSortChange = (field: string) => {
    const newDirection = currentSort?.field === field && currentSort.direction === 'asc' ? 'desc' : 'asc'
    onSortChange({ field, direction: newDirection })
  }

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Filter className="h-5 w-5" />
        <span>{t('filtersAndSort', 'Filters & Sort')}</span>
        {activeFiltersCount > 0 && (
          <span className="ms-1 px-2 py-0.5 bg-primary-600 text-white text-xs font-bold rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute ${isRTL ? 'right-0' : 'left-0'} mt-2 w-96 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('advancedFilters', 'Advanced Filters')}
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    {t('clearAll', 'Clear all')}
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                {/* Filters */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('filterBy', 'Filter By')}</h4>
                  {filters.map((filter) => (
                    <div key={filter.id}>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        {filter.label}
                      </label>
                      
                      {filter.type === 'select' && (
                        <select
                          value={filterValues[filter.id] || ''}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          dir={isRTL ? 'rtl' : 'ltr'}
                        >
                          <option value="">{t('all', 'All')}</option>
                          {filter.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {filter.type === 'multiselect' && (
                        <div className="space-y-2">
                          {filter.options?.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={(filterValues[filter.id] || []).includes(opt.value)}
                                onChange={(e) => {
                                  const current = filterValues[filter.id] || []
                                  const newValue = e.target.checked
                                    ? [...current, opt.value]
                                    : current.filter((v: string) => v !== opt.value)
                                  handleFilterChange(filter.id, newValue)
                                }}
                                className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {filter.type === 'date-range' && (
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            placeholder="From"
                            value={filterValues[`${filter.id}_from`] || ''}
                            onChange={(e) => handleFilterChange(`${filter.id}_from`, e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                          <input
                            type="date"
                            placeholder="To"
                            value={filterValues[`${filter.id}_to`] || ''}
                            onChange={(e) => handleFilterChange(`${filter.id}_to`, e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          />
                        </div>
                      )}

                      {filter.type === 'text' && (
                        <input
                          type="text"
                          value={filterValues[filter.id] || ''}
                          onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                          placeholder={`Filter by ${filter.label.toLowerCase()}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('sortBy', 'Sort By')}</h4>
                  <div className="space-y-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.field}
                        onClick={() => handleSortChange(option.field)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                          currentSort?.field === option.field
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      >
                        <span className="text-sm">{option.label}</span>
                        {currentSort?.field === option.field && (
                          currentSort.direction === 'asc' ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
