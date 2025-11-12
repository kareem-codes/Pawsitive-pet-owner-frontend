'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { appointmentService } from '@/services/appointment.service'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import AdvancedFilter, { SortOption } from '@/components/AdvancedFilter'
import { parseISO, isWithinInterval } from 'date-fns'
import { useI18n } from '@/components/Providers'

const statusConfig = {
  pending: { color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300', icon: AlertCircle },
  confirmed: { color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', icon: CheckCircle2 },
  scheduled: { color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300', icon: CheckCircle2 },
  completed: { color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300', icon: CheckCircle2 },
  cancelled: { color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300', icon: XCircle },
  no_show: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300', icon: XCircle },
}

export default function AppointmentsPage() {
  const { t } = useI18n()
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: 'appointment_date',
    direction: 'desc',
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAll({ page: 1 })
      setAppointments(data.data || [])
    } catch (error) {
      toast.error('Failed to load appointments')
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
        { value: 'pending', label: t('pending', 'Pending') },
        { value: 'confirmed', label: t('confirmed', 'Confirmed') },
        { value: 'scheduled', label: t('scheduled', 'Scheduled') },
        { value: 'completed', label: t('completed', 'Completed') },
        { value: 'cancelled', label: t('cancelled', 'Cancelled') },
        { value: 'no_show', label: t('noShow', 'No Show') },
      ],
    },
    {
      id: 'date',
      label: t('dateRange', 'Date Range'),
      type: 'date-range' as const,
      value: null,
    },
    {
      id: 'type',
      label: t('appointmentType', 'Appointment Type'),
      type: 'select' as const,
      value: '',
      options: [
        { value: 'checkup', label: t('checkup', 'Checkup') },
        { value: 'vaccination', label: t('vaccination', 'Vaccination') },
        { value: 'surgery', label: t('surgery', 'Surgery') },
        { value: 'grooming', label: t('grooming', 'Grooming') },
        { value: 'emergency', label: t('emergency', 'Emergency') },
      ],
    },
  ]

  const sortConfig = [
    { field: 'appointment_date', label: t('date', 'Date') },
    { field: 'pet_name', label: t('petName', 'Pet Name') },
    { field: 'type', label: t('type', 'Type') },
    { field: 'status', label: t('status', 'Status') },
  ]

  const filteredAndSortedAppointments = useMemo(() => {
    let result = [...appointments]

    // Apply filters
    if (filters.status && filters.status.length > 0) {
      result = result.filter((apt) => filters.status.includes(apt.status))
    }

    if (filters.type) {
      result = result.filter((apt) => apt.type === filters.type)
    }

    if (filters.date_from || filters.date_to) {
      result = result.filter((apt) => {
        const aptDate = parseISO(apt.appointment_date)
        const from = filters.date_from ? parseISO(filters.date_from) : new Date('1900-01-01')
        const to = filters.date_to ? parseISO(filters.date_to) : new Date('2100-01-01')
        
        return isWithinInterval(aptDate, { start: from, end: to })
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[currentSort.field]
      let bValue = b[currentSort.field]

      if (currentSort.field === 'appointment_date') {
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
  }, [appointments, filters, currentSort])

  const filteredAppointments = statusFilter === 'all'
    ? filteredAndSortedAppointments
    : filteredAndSortedAppointments.filter((a) => a.status === statusFilter)

  const upcomingAppointments = filteredAppointments.filter(
    apt => new Date(apt.appointment_date) >= new Date() && 
           ['pending', 'confirmed', 'scheduled'].includes(apt.status)
  )
  
  const pastAppointments = filteredAppointments.filter(
    apt => new Date(apt.appointment_date) < new Date() || 
           ['completed', 'cancelled', 'no_show'].includes(apt.status)
  )

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  const AppointmentCard = ({ appointment, index }: { appointment: any; index: number }) => {
    const config = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.pending
    const StatusIcon = config.icon

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{appointment.type}</h3>
              <p className="text-gray-600 dark:text-gray-400">{appointment.pet?.name}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            <span>{t(appointment.status, appointment.status)}</span>
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="h-4 w-4 me-2" />
            {formatDate(appointment.appointment_date)}
            <span className="mx-2">•</span>
            {appointment.duration_minutes} min
          </div>
          {appointment.reason && (
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t('reason', 'Reason')}:</span> {appointment.reason}
            </p>
          )}
          {appointment.veterinarian && (
            <p className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">{t('vet', 'Vet')}:</span> Dr. {appointment.veterinarian.name}
            </p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href={`/dashboard/appointments/${appointment.id}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
          >
            {t('viewDetails', 'View Details')} →
          </Link>
        </div>
      </motion.div>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('appointments', 'Appointments')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('manageYourPetAppointments', 'Manage your pet\'s appointments')}
            </p>
          </div>
          <Link
            href="/dashboard/appointments/new"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5 me-2" />
            {t('bookAppointment', 'Book Appointment')}
          </Link>
        </div>

        {/* Filters and Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
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
              <option value="all">{t('allAppointments', 'All Appointments')}</option>
              <option value="pending">{t('pending', 'Pending')}</option>
              <option value="confirmed">{t('confirmed', 'Confirmed')}</option>
              <option value="scheduled">{t('scheduled', 'Scheduled')}</option>
              <option value="completed">{t('completed', 'Completed')}</option>
              <option value="cancelled">{t('cancelled', 'Cancelled')}</option>
            </select>
          </div>
        </div>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('upcomingAppointments', 'Upcoming Appointments')} ({upcomingAppointments.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingAppointments.map((appointment, index) => (
                <AppointmentCard key={appointment.id} appointment={appointment} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('pastAppointments', 'Past Appointments')} ({pastAppointments.length})
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastAppointments.map((appointment, index) => (
                <AppointmentCard key={appointment.id} appointment={appointment} index={index + upcomingAppointments.length} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t('noAppointmentsFound', 'No appointments found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {statusFilter !== 'all' ? t('tryChangingFilter', 'Try changing the filter') : t('bookYourFirstAppointment', 'Book your first appointment to get started')}
            </p>
            {statusFilter === 'all' && (
              <Link
                href="/dashboard/appointments/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 me-2" />
                {t('bookYourFirstAppointment', 'Book Your First Appointment')}
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
