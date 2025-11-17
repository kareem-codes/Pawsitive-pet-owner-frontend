'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  FileText,
  Calendar,
  Activity,
  Thermometer,
  Weight,
  Pill,
  Filter,
  Download,
  Eye,
  Search,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { petService } from '@/services/pet.service'
import { medicalRecordService } from '@/services/medical-record.service'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import AdvancedFilter, { SortOption } from '@/components/AdvancedFilter'
import { parseISO, isWithinInterval } from 'date-fns'
import { useI18n } from '@/components/Providers'

function MedicalRecordsContent() {
  const { t } = useI18n()
  const searchParams = useSearchParams()
  const [records, setRecords] = useState<any[]>([])
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<string>(searchParams?.get('pet_id') || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [currentSort, setCurrentSort] = useState<SortOption>({
    field: 'visit_date',
    direction: 'desc',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const petsData = await petService.getAll()
      setPets(petsData)
      
      // Fetch actual medical records from API
      const medicalRecordsResponse = await medicalRecordService.getAll()
      const recordsData = medicalRecordsResponse.data || []
      
      // Map records to include pet info
      const enrichedRecords = recordsData.map((record: any) => {
        const pet = petsData.find((p: any) => p.id === record.pet_id)
        return {
          ...record,
          pet_name: pet?.name || 'Unknown',
          pet_species: pet?.species || 'Unknown',
          veterinarian_name: record.veterinarian?.name || 'Unknown',
        }
      })
      
      setRecords(enrichedRecords)
    } catch (error) {
      console.error('Error loading medical records:', error)
      toast.error('Failed to load medical records')
    } finally {
      setLoading(false)
    }
  }

  const filterConfig = [
    {
      id: 'pet',
      label: t('pet', 'Pet'),
      type: 'select' as const,
      value: '',
      options: pets.map((pet: any) => ({ value: pet.id.toString(), label: pet.name })),
    },
    {
      id: 'record_type',
      label: t('recordType', 'Record Type'),
      type: 'multiselect' as const,
      value: [],
      options: [
        { value: 'checkup', label: t('checkup', 'Checkup') },
        { value: 'vaccination', label: t('vaccination', 'Vaccination') },
        { value: 'surgery', label: t('surgery', 'Surgery') },
        { value: 'emergency', label: t('emergency', 'Emergency') },
        { value: 'dental', label: t('dental', 'Dental') },
      ],
    },
    {
      id: 'visit_date',
      label: t('visitDate', 'Visit Date Range'),
      type: 'date-range' as const,
      value: null,
    },
    {
      id: 'search',
      label: t('search', 'Search'),
      type: 'text' as const,
      value: '',
    },
  ]

  const sortConfig = [
    { field: 'visit_date', label: t('visitDate', 'Visit Date') },
    { field: 'pet_name', label: t('petName', 'Pet Name') },
    { field: 'veterinarian_name', label: t('veterinarian', 'Veterinarian') },
    { field: 'diagnosis', label: t('diagnosis', 'Diagnosis') },
  ]

  const filteredAndSortedRecords = useMemo(() => {
    let result = [...records]

    // Apply filters
    if (filters.pet) {
      result = result.filter((r) => r.pet_id.toString() === filters.pet)
    }

    if (filters.record_type && filters.record_type.length > 0) {
      result = result.filter((r) => filters.record_type.includes(r.record_type))
    }

    if (filters.search) {
      const query = filters.search.toLowerCase()
      result = result.filter((r) =>
        r.diagnosis.toLowerCase().includes(query) ||
        r.veterinarian_name.toLowerCase().includes(query) ||
        r.pet_name.toLowerCase().includes(query)
      )
    }

    if (filters.visit_date_from || filters.visit_date_to) {
      result = result.filter((r) => {
        const recordDate = parseISO(r.visit_date)
        const from = filters.visit_date_from ? parseISO(filters.visit_date_from) : new Date('1900-01-01')
        const to = filters.visit_date_to ? parseISO(filters.visit_date_to) : new Date('2100-01-01')
        
        return isWithinInterval(recordDate, { start: from, end: to })
      })
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[currentSort.field]
      let bValue = b[currentSort.field]

      if (currentSort.field === 'visit_date') {
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
  }, [records, filters, currentSort])

  const filteredRecords = selectedPet === 'all' 
    ? filteredAndSortedRecords 
    : filteredAndSortedRecords.filter((r) => r.pet_id.toString() === selectedPet)

  const handleViewDetails = (record: any) => {
    setSelectedRecord(record)
    setShowDetailModal(true)
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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('medicalRecords', 'Medical Records')}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {t('viewYourMedicalHistory', 'View your pets\' complete medical history')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('totalRecords', 'Total Records')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {records.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('petsWithRecords', 'Pets with Records')}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {new Set(records.map(r => r.pet_id)).size}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('lastVisit', 'Last Visit')}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
                  {records.length > 0 ? formatDate(records[0].visit_date).split(',')[0] : t('notAvailable', 'N/A')}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Advanced Filter */}
          <AdvancedFilter
            filters={filterConfig}
            sortOptions={sortConfig}
            onFilterChange={setFilters}
            onSortChange={setCurrentSort}
            currentSort={currentSort}
          />

          {/* Pet Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <select
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              <option value="all">{t('allPets', 'All Pets')}</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id.toString()}>
                  {pet.name} ({pet.species})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Records List */}
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t('noRecordsFound', 'No medical records found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedPet !== 'all' 
                ? t('tryAdjustingFilters', 'Try adjusting your filters')
                : t('medicalRecordsWillAppear', 'Medical records will appear here after vet visits')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {record.diagnosis}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {record.pet_name} • {record.pet_species}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {formatDate(record.visit_date).split(',')[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {record.veterinarian_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Weight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {record.weight} kg
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Thermometer className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            {record.temperature}°C
                          </span>
                        </div>
                      </div>

                      {record.prescriptions && (
                        <div className="mt-3 flex items-start gap-2 text-sm">
                          <Pill className="h-4 w-4 text-primary-600 dark:text-primary-400 mt-0.5" />
                          <span className="text-gray-700 dark:text-gray-300">
                            <strong>{t('prescriptions', 'Prescription')}:</strong> {record.prescriptions}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ms-4">
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                      title={t('viewDetails', 'View Details')}
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title={t('download', 'Download')}
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedRecord && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setShowDetailModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full p-6"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {t('recordDetails', 'Medical Record Details')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedRecord.pet_name} - {formatDate(selectedRecord.visit_date)}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('diagnosis', 'Diagnosis')}</h3>
                    <p className="text-lg text-gray-900 dark:text-gray-100">{selectedRecord.diagnosis}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('treatment', 'Treatment')}</h3>
                    <p className="text-gray-900 dark:text-gray-100">{selectedRecord.treatment}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('veterinarian', 'Veterinarian')}</h3>
                      <p className="text-gray-900 dark:text-gray-100">{selectedRecord.veterinarian_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('visitDate', 'Visit Date')}</h3>
                      <p className="text-gray-900 dark:text-gray-100">{formatDate(selectedRecord.visit_date)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('weight', 'Weight')}</h3>
                      <p className="text-gray-900 dark:text-gray-100">{selectedRecord.weight} {t('kg', 'kg')}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('temperature', 'Temperature')}</h3>
                      <p className="text-gray-900 dark:text-gray-100">{selectedRecord.temperature}°C</p>
                    </div>
                  </div>

                  {selectedRecord.prescriptions && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('prescriptions', 'Prescriptions')}</h3>
                      <p className="text-gray-900 dark:text-gray-100">{selectedRecord.prescriptions}</p>
                    </div>
                  )}

                  {selectedRecord.notes && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('notes', 'Notes')}</h3>
                      <p className="text-gray-900 dark:text-gray-100">{selectedRecord.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t('close', 'Close')}
                  </button>
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>{t('downloadInvoice', 'Download PDF')}</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

function LoadingFallback() {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-gray-600 dark:text-gray-400">{t('loading', 'Loading...')}</div>
    </div>
  )
}

export default function MedicalRecordsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MedicalRecordsContent />
    </Suspense>
  )
}
