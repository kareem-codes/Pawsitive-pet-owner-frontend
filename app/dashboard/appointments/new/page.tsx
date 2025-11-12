'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react'
import DashboardLayout from '@/components/DashboardLayout'
import { petService } from '@/services/pet.service'
import { appointmentService } from '@/services/appointment.service'
import toast from 'react-hot-toast'

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pets, setPets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    pet_id: searchParams?.get('pet_id') || '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: '30',
    type: 'checkup',
    reason: '',
    notes: '',
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.pet_id) {
      toast.error('Please select a pet')
      return
    }

    if (!formData.appointment_date || !formData.appointment_time) {
      toast.error('Please select date and time')
      return
    }

    setSaving(true)

    try {
      const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`
      
      const appointmentData: any = {
        pet_id: parseInt(formData.pet_id),
        appointment_date: appointmentDateTime,
        duration_minutes: parseInt(formData.duration_minutes),
        type: formData.type,
        reason: formData.reason,
        notes: formData.notes,
        status: 'pending',
      }
      
      await appointmentService.create(appointmentData)
      toast.success('Appointment booked successfully!')
      router.push('/dashboard/appointments')
    } catch (error: any) {
      toast.error(error.message || 'Failed to book appointment')
    } finally {
      setSaving(false)
    }
  }

  // Get minimum date (today)
  const minDate = new Date().toISOString().split('T')[0]
  
  // Get minimum time if today is selected
  const getMinTime = () => {
    if (formData.appointment_date === minDate) {
      const now = new Date()
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    }
    return '08:00'
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-4"
          >
            <ArrowLeft className="h-5 w-5 me-2" />
            Back to Appointments
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Book Appointment</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Schedule a visit for your pet
          </p>
        </div>

        {pets.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You need to add a pet before booking an appointment
            </p>
            <Link
              href="/dashboard/pets/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Add Your First Pet
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pet Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Pet <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="pet_id"
                    value={formData.pet_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Choose a pet...</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.species})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Appointment Type */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Appointment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="checkup">General Checkup</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="surgery">Surgery</option>
                    <option value="grooming">Grooming</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <CalendarIcon className="inline h-4 w-4 me-1" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    min={minDate}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="inline h-4 w-4 me-1" />
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="appointment_time"
                    value={formData.appointment_time}
                    onChange={handleChange}
                    min={getMinTime()}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>

                {/* Reason */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Reason for Visit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Annual checkup, skin irritation, vaccination due"
                  />
                </div>

                {/* Additional Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Any additional information for the veterinarian..."
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> Your appointment request will be reviewed by our staff. 
                  You'll receive a confirmation once a veterinarian is assigned.
                </p>
              </div>

              {/* Form Actions */}
              <div className="mt-8 flex items-center justify-end gap-4">
                <Link
                  href="/dashboard/appointments"
                  className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 me-2" />
                  {saving ? 'Booking...' : 'Book Appointment'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
