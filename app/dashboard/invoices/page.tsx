'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  FileText,
  Download,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import AdvancedFilter, { SortOption } from '@/components/AdvancedFilter'
import SortableTable, { TableColumn } from '@/components/SortableTable'
import { parseISO, isWithinInterval, format } from 'date-fns'
import { invoiceService } from '@/services/invoice.service'
import { useI18n } from '@/components/Providers'

const statusConfig = {
  paid: { color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', icon: CheckCircle },
  pending: { color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300', icon: Clock },
  partially_paid: { color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', icon: AlertCircle },
  overdue: { color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', icon: AlertCircle },
}

export default function InvoicesPage() {
  const { t } = useI18n()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: 'invoice_date',
    direction: 'desc',
  })

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const response = await invoiceService.getAll({ page: 1 })
      const invoicesData = response.data || []
      
      // Map invoices to include pet name
      const enrichedInvoices = invoicesData.map((invoice: any) => ({
        ...invoice,
        pet_name: invoice.pet?.name || 'General',
        total_amount: invoice.total || invoice.total_amount || 0,
      }))
      
      setInvoices(enrichedInvoices)
    } catch (error) {
      console.error('Error loading invoices:', error)
      toast.error('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  const filterConfig = [
    {
      id: 'status',
      label: t('status', 'Status'),
      type: 'multiselect' as const,
      value: [],
      options: [
        { value: 'paid', label: t('paid', 'Paid') },
        { value: 'pending', label: t('pending', 'Pending') },
        { value: 'partially_paid', label: t('partiallyPaid', 'Partially Paid') },
        { value: 'overdue', label: t('overdue', 'Overdue') },
      ],
    },
    {
      id: 'invoice_date',
      label: t('invoiceDate', 'Invoice Date Range'),
      type: 'date-range' as const,
      value: null,
    },
    {
      id: 'amount_min',
      label: t('minimumAmount', 'Minimum Amount'),
      type: 'text' as const,
      value: '',
    },
  ]

  const sortConfig = [
    { field: 'invoice_date', label: t('invoiceDate', 'Invoice Date') },
    { field: 'due_date', label: t('dueDate', 'Due Date') },
    { field: 'total_amount', label: t('amount', 'Amount') },
    { field: 'status', label: t('status', 'Status') },
  ]

  const filteredAndSortedInvoices = useMemo(() => {
    let result = [...invoices]

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      result = result.filter((inv) => filters.status.includes(inv.status))
    }

    if (filters.invoice_date_from || filters.invoice_date_to) {
      result = result.filter((inv) => {
        const invDate = parseISO(inv.invoice_date)
        const from = filters.invoice_date_from ? parseISO(filters.invoice_date_from) : new Date('1900-01-01')
        const to = filters.invoice_date_to ? parseISO(filters.invoice_date_to) : new Date('2100-01-01')
        
        return isWithinInterval(invDate, { start: from, end: to })
      })
    }

    if (filters.amount_min) {
      result = result.filter((inv) => inv.total_amount >= parseFloat(filters.amount_min))
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[currentSort.field]
      let bValue = b[currentSort.field]

      if (currentSort.field === 'invoice_date' || currentSort.field === 'due_date') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (currentSort.direction === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return result
  }, [invoices, filters, currentSort])

  const filteredInvoices = statusFilter === 'all'
    ? filteredAndSortedInvoices
    : filteredAndSortedInvoices.filter(inv => inv.status === statusFilter)

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total_amount, 0)
  const totalPending = invoices.filter(i => i.status !== 'paid').reduce((sum, i) => sum + i.total_amount, 0)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('invoices', 'Invoices & Payments')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('billingAndPayments', 'View your billing history and payments')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalPaid', 'Total Paid')}</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                  ${totalPaid.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalPending', 'Pending')}</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">
                  ${totalPending.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalInvoices', 'Total Invoices')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {invoices.length}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-xl">
                <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <AdvancedFilter
            filters={filterConfig}
            sortOptions={sortConfig}
            onFilterChange={setFilters}
            onSortChange={setCurrentSort}
            currentSort={currentSort}
          />
          
          <div className="relative flex-1 max-w-xs">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              <option value="all">{t('allInvoices', 'All Invoices')}</option>
              <option value="paid">{t('paid', 'Paid')}</option>
              <option value="pending">{t('pending', 'Pending')}</option>
              <option value="partially_paid">{t('partiallyPaid', 'Partially Paid')}</option>
              <option value="overdue">{t('overdue', 'Overdue')}</option>
            </select>
          </div>
        </div>

        {/* Table Columns */}
        {(() => {
          const tableColumns: TableColumn[] = [
            {
              key: 'invoice_number',
              label: t('invoiceNumber', 'Invoice #'),
              sortable: true,
            },
            {
              key: 'pet_name',
              label: t('pet', 'Pet'),
              sortable: true,
            },
            {
              key: 'invoice_date',
              label: t('invoiceDate', 'Invoice Date'),
              sortable: true,
              render: (value) => format(parseISO(value), 'MMM dd, yyyy'),
            },
            {
              key: 'due_date',
              label: t('dueDate', 'Due Date'),
              sortable: true,
              render: (value) => format(parseISO(value), 'MMM dd, yyyy'),
            },
            {
              key: 'total_amount',
              label: t('amount', 'Amount'),
              sortable: true,
              render: (value) => (
                <span className="font-semibold">${value.toFixed(2)}</span>
              ),
            },
            {
              key: 'status',
              label: t('status', 'Status'),
              sortable: true,
              render: (value) => {
                const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.pending
                const StatusIcon = config.icon
                return (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                    <StatusIcon className="h-3 w-3 me-1" />
                    {t(value, value.replace('_', ' ').toUpperCase())}
                  </span>
                )
              },
            },
            {
              key: 'actions',
              label: t('actions', 'Actions'),
              render: (_, row) => (
                <button
                  onClick={async (e) => {
                    e.stopPropagation()
                    try {
                      const blob = await invoiceService.downloadPdf(row.id)
                      const url = window.URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${row.invoice_number}.pdf`
                      document.body.appendChild(a)
                      a.click()
                      window.URL.revokeObjectURL(url)
                      document.body.removeChild(a)
                      toast.success(t('invoiceDownloaded', 'Invoice downloaded'))
                    } catch (error) {
                      toast.error(t('failedToDownloadInvoice', 'Failed to download invoice'))
                    }
                  }}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  <Download className="h-5 w-5" />
                </button>
              ),
            },
          ]

          return (
            <SortableTable
              columns={tableColumns}
              data={filteredInvoices}
              onSort={(config) => setCurrentSort({ field: config.key, direction: config.direction })}
              defaultSort={{ key: currentSort.field, direction: currentSort.direction }}
              emptyMessage={t('noInvoicesFound', 'No invoices found')}
              onRowClick={(row) => {
                // Navigate to invoice detail page
                console.log(`Viewing invoice ${row.invoice_number}`)
              }}
            />
          )
        })()}
      </div>
    </DashboardLayout>
  )
}
