'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Heart,
  Plus,
  Search,
  Filter,
  Dog,
  Cat,
  Bird,
  Fish,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { petService } from '@/services/pet.service'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useI18n } from '@/components/Providers'

export default function PetsPage() {
  const { t } = useI18n()
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [speciesFilter, setSpeciesFilter] = useState('all')

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const data = await petService.getAll()
      setPets(data)
    } catch (error) {
      toast.error('Failed to load pets')
    } finally {
      setLoading(false)
    }
  }

  const filteredPets = pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecies = speciesFilter === 'all' || pet.species === speciesFilter
    return matchesSearch && matchesSpecies
  })

  const getSpeciesIcon = (species: string) => {
    switch (species.toLowerCase()) {
      case 'dog': return Dog
      case 'cat': return Cat
      case 'bird': return Bird
      case 'fish': return Fish
      default: return Heart
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

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('myPets', 'My Pets')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {t('manageYourBelovedCompanions', 'Manage your beloved companions')}
            </p>
          </div>
          <Link
            href="/dashboard/pets/new"
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Plus className="h-5 w-5 me-2" />
            {t('addNewPet', 'Add New Pet')}
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('searchPetsByName', 'Search pets by name or breed...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Species Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <select
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
              className="w-full ps-10 pe-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            >
              <option value="all">{t('allSpecies', 'All Species')}</option>
              <option value="dog">{t('dogs', 'Dogs')}</option>
              <option value="cat">{t('cats', 'Cats')}</option>
              <option value="bird">{t('birds', 'Birds')}</option>
              <option value="fish">{t('fish', 'Fish')}</option>
              <option value="other">{t('other', 'Other')}</option>
            </select>
          </div>
        </div>

        {/* Pets Grid */}
        {filteredPets.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <Heart className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery || speciesFilter !== 'all' ? t('noPetsFound', 'No pets found') : t('noPetsYet', 'No pets yet')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || speciesFilter !== 'all' 
                ? t('tryAdjustingFilters', 'Try adjusting your search or filters')
                : t('addYourFirstPet', 'Add your first pet to get started')}
            </p>
            {!searchQuery && speciesFilter === 'all' && (
              <Link
                href="/dashboard/pets/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 me-2" />
                {t('addYourFirstPet', 'Add your first pet')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet, index) => {
              const SpeciesIcon = getSpeciesIcon(pet.species)
              return (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={`/dashboard/pets/${pet.id}`}
                    className="block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all group overflow-hidden"
                  >
                    {/* Pet Image */}
                    <div className="aspect-square bg-gradient-to-br from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 relative overflow-hidden">
                      {pet.photo || pet.image_url ? (
                        <img
                          src={pet.photo || pet.image_url}
                          alt={pet.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <SpeciesIcon className="h-24 w-24 text-primary-300 dark:text-primary-700" />
                        </div>
                      )}
                    </div>

                    {/* Pet Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {pet.name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium">{t('species', 'Species')}:</span> {pet.species}</p>
                        <p><span className="font-medium">{t('breed', 'Breed')}:</span> {pet.breed || t('unknown', 'Unknown')}</p>
                        {(pet.birth_date || pet.date_of_birth) && (
                          <p><span className="font-medium">{t('age', 'Age')}:</span> {pet.age || t('notAvailable', 'N/A')} {t('years', 'years')}</p>
                        )}
                        <p><span className="font-medium">{t('gender', 'Gender')}:</span> <span className="capitalize">{pet.gender ? t(pet.gender, pet.gender) : t('unknown', 'Unknown')}</span></p>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-4 flex items-center gap-2">
                        <span className="px-3 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                          {pet.status === 'active' ? t('active', 'Active') : (pet.status || t('active', 'Active'))}
                        </span>
                        {pet.microchip_id && (
                          <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                            {t('microchipped', 'Microchipped')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
