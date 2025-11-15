'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Heart,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { dashboardService } from '@/services/dashboard.service'
import { appointmentService } from '@/services/appointment.service'
import { petService } from '@/services/pet.service'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useI18n } from '@/components/Providers'

export default function DashboardPage() {
  const { t } = useI18n()
  const [stats, setStats] = useState<any>(null)
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([])
  const [recentPets, setRecentPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, appointmentsData, petsData] = await Promise.all([
          dashboardService.getStats(),
          appointmentService.getAll({ page: 1, status: 'scheduled' }),
          petService.getAll(),
        ])
        setStats(statsData)
        setUpcomingAppointments(appointmentsData.data?.slice(0, 3) || [])
        setRecentPets(petsData.slice(0, 4) || [])
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      name: t('totalPets', 'Total Pets'),
      value: stats?.pets?.total || 0,
      icon: Heart,
      color: 'from-primary-500 to-purple-500',
      href: '/dashboard/pets',
    },
    {
      name: t('upcomingAppointments', 'Upcoming Appointments'),
      value: stats?.appointments?.upcoming || 0,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      href: '/dashboard/appointments',
    },
    {
      name: t('unpaidInvoices', 'Unpaid Invoices'),
      value: stats?.invoices?.unpaid || 0,
      icon: FileText,
      color: 'from-purple-500 to-indigo-500',
      href: '/dashboard/invoices',
    },
    {
      name: t('unpaidAmount', 'Unpaid Amount'),
      value: `$${Number(stats?.invoices?.unpaid_amount || 0).toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      href: '/dashboard/invoices',
    },
  ]

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

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link
                href={stat.href}
                className="block bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} transform group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('upcomingAppointments', 'Upcoming Appointments')}</h2>
              <Link
                href="/dashboard/appointments"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center"
              >
                {t('viewAll', 'View all')}
                <ArrowRight className="h-4 w-4 ms-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">{t('noUpcomingAppointments', 'No upcoming appointments')}</p>
                  <Link
                    href="/dashboard/appointments/new"
                    className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    {t('scheduleOneNow', 'Schedule one now')}
                  </Link>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{appointment.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.pet?.name}</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="h-4 w-4 me-1" />
                        {formatDate(appointment.appointment_date)}
                      </div>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                      {t(appointment.status, appointment.status)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          {/* Recent Pets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('myPets', 'My Pets')}</h2>
              <Link
                href="/dashboard/pets"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm flex items-center"
              >
                {t('viewAll', 'View all')}
                <ArrowRight className="h-4 w-4 ms-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {recentPets.length === 0 ? (
                <div className="col-span-2 text-center py-8">
                  <Heart className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">{t('noPetsAddedYet', 'No pets added yet')}</p>
                  <Link
                    href="/dashboard/pets/new"
                    className="inline-block mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  >
                    {t('addYourFirstPet', 'Add your first pet')}
                  </Link>
                </div>
              ) : (
                recentPets.map((pet) => (
                  <Link
                    key={pet.id}
                    href={`/dashboard/pets/${pet.id}`}
                    className="block p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg transition-all group"
                  >
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 mb-3 overflow-hidden">
                      {pet.photo_url ? (
                        <img
                          src={pet.photo_url}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Heart className="h-12 w-12 text-primary-300 dark:text-primary-700" />
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{pet.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pet.species}</p>
                  </Link>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('quickActions', 'Quick Actions')}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard/appointments/new"
              className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Calendar className="h-8 w-8" />
              <div>
                <p className="font-semibold">{t('bookAppointment', 'Book Appointment')}</p>
                <p className="text-sm text-blue-100">{t('scheduleAVisit', 'Schedule a visit')}</p>
              </div>
            </Link>
            <Link
              href="/dashboard/pets/new"
              className="flex items-center gap-4 p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Heart className="h-8 w-8" />
              <div>
                <p className="font-semibold">{t('addPet', 'Add Pet')}</p>
                <p className="text-sm text-pink-100">{t('registerNewPet', 'Register a new pet')}</p>
              </div>
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <FileText className="h-8 w-8" />
              <div>
                <p className="font-semibold">{t('shopProducts', 'Shop Products')}</p>
                <p className="text-sm text-purple-100">{t('browseOurStore', 'Browse our store')}</p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
