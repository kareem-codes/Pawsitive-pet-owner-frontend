'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Edit,
  Calendar,
  Heart,
  FileText,
  Syringe,
  Activity,
  Trash2,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { petService } from '@/services/pet.service'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useI18n } from '@/components/Providers'

export default function PetDetailPage() {
  const { t } = useI18n()
  const params = useParams()
  const router = useRouter()
  const [pet, setPet] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchPet()
    }
  }, [params.id])

  const fetchPet = async () => {
    try {
      const data = await petService.getById(Number(params.id))
      console.log('Pet data:', data) // Debug log
      setPet(data)
    } catch (error) {
      console.error('Error loading pet:', error)
      toast.error('Failed to load pet details')
      router.push('/dashboard/pets')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t('confirmDeletePet', `Are you sure you want to delete ${pet.name}? This action cannot be undone.`))) {
      return
    }

    setDeleting(true)
    try {
      await petService.delete(pet.id)
      toast.success(t('petDeletedSuccessfully', 'Pet deleted successfully'))
      router.push('/dashboard/pets')
    } catch (error) {
      toast.error(t('failedToDeletePet', 'Failed to delete pet'))
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (!pet) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/pets"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
          >
            <ArrowLeft className="h-5 w-5 me-2" />
            {t('backToPets', 'Back to Pets')}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
                {pet.photo || pet.image_url ? (
                  <img src={pet.photo || pet.image_url} alt={pet.name} className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <Heart className="h-10 w-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pet.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {pet.species} {pet.breed ? `• ${pet.breed}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Link
                href={`/dashboard/pets/${pet.id}/edit`}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all"
              >
                <Edit className="h-4 w-4 me-2" />
                {t('edit', 'Edit')}
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 me-2" />
                {deleting ? t('deleting', 'Deleting...') : t('delete', 'Delete')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('basicInformation', 'Basic Information')}</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('species', 'Species')}</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100">{pet.species}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('breed', 'Breed')}</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100">{pet.breed || t('unknown', 'Unknown')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('gender', 'Gender')}</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100 capitalize">{pet.gender ? t(pet.gender, pet.gender) : t('unknown', 'Unknown')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('dateOfBirth', 'Date of Birth')}</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100">
                    {pet.birth_date || pet.date_of_birth ? formatDate(pet.birth_date || pet.date_of_birth) : t('unknown', 'Unknown')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('color', 'Color')}</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100">{pet.color || t('notSpecified', 'Not specified')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('weight', 'Weight')}</dt>
                  <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100">{pet.weight ? `${pet.weight} ${t('kg', 'kg')}` : t('notRecorded', 'Not recorded')}</dd>
                </div>
                {pet.microchip_id && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('microchipId', 'Microchip ID')}</dt>
                    <dd className="mt-1 text-lg text-gray-900 dark:text-gray-100">{pet.microchip_id}</dd>
                  </div>
                )}
                {pet.allergies && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('allergies', 'Allergies')}</dt>
                    <dd className="mt-1 text-gray-900 dark:text-gray-100">{pet.allergies}</dd>
                  </div>
                )}
                {pet.notes && (
                  <div className="md:col-span-2">
                    <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('notes', 'Notes')}</dt>
                    <dd className="mt-1 text-gray-900 dark:text-gray-100">{pet.notes}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Medical History */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('recentMedicalRecords', 'Recent Medical Records')}</h2>
              {pet.medical_records && pet.medical_records.length > 0 ? (
                <div className="space-y-4">
                  {pet.medical_records.slice(0, 3).map((record: any) => (
                    <div key={record.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                      <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{record.diagnosis || record.title || t('medicalRecord', 'Medical Record')}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.visit_date ? formatDate(record.visit_date) : formatDate(record.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Link
                    href={`/dashboard/medical-records?pet_id=${pet.id}`}
                    className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
                  >
                    {t('viewAllMedicalRecords', 'View all medical records')} →
                  </Link>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{t('noMedicalRecordsYet', 'No medical records yet')}</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('quickStats', 'Quick Stats')}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('appointments', 'Appointments')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {pet.appointments?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('medicalRecords', 'Medical Records')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {pet.medical_records?.length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                    <Syringe className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t('vaccinations', 'Vaccinations')}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {pet.vaccinations?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/dashboard/appointments/new?pet_id=${pet.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment</span>
                </Link>
                <Link
                  href={`/dashboard/medical-records?pet_id=${pet.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <FileText className="h-5 w-5" />
                  <span>View Medical Records</span>
                </Link>
                <Link
                  href={`/dashboard/pets/${pet.id}/weight`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  <Activity className="h-5 w-5" />
                  <span>Weight History</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
