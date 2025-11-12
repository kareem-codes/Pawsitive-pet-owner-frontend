'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  className?: string
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface SortableTableProps {
  columns: TableColumn[]
  data: any[]
  onSort?: (config: SortConfig) => void
  defaultSort?: SortConfig
  emptyMessage?: string
  onRowClick?: (row: any) => void
}

export default function SortableTable({
  columns,
  data,
  onSort,
  defaultSort,
  emptyMessage = 'No data available',
  onRowClick,
}: SortableTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(defaultSort || null)

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const newConfig = { key, direction }
    setSortConfig(newConfig)
    
    if (onSort) {
      onSort(newConfig)
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue === bValue) return 0

    if (aValue === null || aValue === undefined) return 1
    if (bValue === null || bValue === undefined) return -1

    let comparison = 0
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime()
    } else {
      comparison = aValue > bValue ? 1 : -1
    }

    return sortConfig.direction === 'asc' ? comparison : -comparison
  })

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />
    }
    
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="h-4 w-4 text-primary-600 dark:text-primary-400" />
    ) : (
      <ArrowDown className="h-4 w-4 text-primary-600 dark:text-primary-400" />
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-4 text-start text-sm font-semibold text-gray-700 dark:text-gray-300 ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none' : ''
                  } ${column.className || ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={`border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                  onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''
                } transition-colors`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${column.className || ''}`}
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
