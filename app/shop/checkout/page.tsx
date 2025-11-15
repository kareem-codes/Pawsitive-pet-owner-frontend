"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/components/Providers'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  MapPin,
  Phone,
  Mail,
  User,
  ArrowLeft,
  CreditCard,
  Package,
  CheckCircle,
} from 'lucide-react'
import { useCartStore } from '@/stores/cart'
import { orderService } from '@/services/order.service'
import { authService } from '@/services/auth.service'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { items, getTotal, getSubtotal, getTax, clearCart } = useCartStore()
  
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_phone: '',
    notes: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0 && !orderPlaced) {
      toast.error(t('cartEmpty', 'Your cart is empty'))
      router.push('/shop')
    }

    // Load user info
    const loadUserInfo = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          setUserEmail(user.email || '')
          setFormData(prev => ({
            ...prev,
            shipping_phone: user.phone || '',
            shipping_address: user.address || '',
            shipping_city: user.city || '',
            shipping_state: user.state || '',
            shipping_postal_code: user.postal_code || '',
          }))
        }
      } catch (error) {
        console.error('Error loading user info:', error)
      }
    }

    loadUserInfo()
  }, [items.length, orderPlaced, router, t])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error(t('cartEmpty', 'Your cart is empty'))
      return
    }

    // Validation
    if (!formData.shipping_address.trim()) {
      toast.error(t('addressRequired', 'Shipping address is required'))
      return
    }

    if (!formData.shipping_phone.trim()) {
      toast.error(t('phoneRequired', 'Phone number is required'))
      return
    }

    setLoading(true)
    
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        shipping_address: formData.shipping_address,
        shipping_city: formData.shipping_city || undefined,
        shipping_state: formData.shipping_state || undefined,
        shipping_postal_code: formData.shipping_postal_code || undefined,
        shipping_phone: formData.shipping_phone,
        notes: formData.notes || undefined,
      }

      const response = await orderService.placeOrder(orderData)
      
      setOrderNumber(response.order.invoice_number)
      setOrderPlaced(true)
      clearCart()
      toast.success(t('orderPlacedSuccess', 'Order placed successfully!'))
    } catch (error: any) {
      console.error('Error placing order:', error)
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to place order'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center"
        >
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t('orderConfirmed', 'Order Confirmed!')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('orderNumberIs', 'Your order number is')}
            </p>
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">
              {orderNumber}
            </p>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {t('orderConfirmationMessage', 'We\'ve received your order and will process it shortly. You\'ll receive updates via email.')}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/dashboard/invoices')}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all"
            >
              {t('viewMyOrders', 'View My Orders')}
            </button>
            <button
              onClick={() => router.push('/shop')}
              className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-3 px-6 rounded-xl font-semibold transition-all"
            >
              {t('continueShopping', 'Continue Shopping')}
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => router.push('/shop')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">{t('backToShop', 'Back to Shop')}</span>
        </button>

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-2">
            {t('checkout', 'Checkout')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('completeYourOrder', 'Complete your order by providing shipping information')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('shippingInformation', 'Shipping Information')}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('email', 'Email')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('phoneNumber', 'Phone Number')} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="shipping_phone"
                        value={formData.shipping_phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+966 50 123 4567"
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('streetAddress', 'Street Address')} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="shipping_address"
                      value={formData.shipping_address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder={t('enterAddress', 'Enter your full street address')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('city', 'City')}
                      </label>
                      <input
                        type="text"
                        name="shipping_city"
                        value={formData.shipping_city}
                        onChange={handleInputChange}
                        placeholder={t('enterCity', 'Enter city')}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        {t('state', 'State/Province')}
                      </label>
                      <input
                        type="text"
                        name="shipping_state"
                        value={formData.shipping_state}
                        onChange={handleInputChange}
                        placeholder={t('enterState', 'Enter state')}
                        className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('postalCode', 'Postal Code')}
                    </label>
                    <input
                      type="text"
                      name="shipping_postal_code"
                      value={formData.shipping_postal_code}
                      onChange={handleInputChange}
                      placeholder={t('enterPostalCode', 'Enter postal code')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {t('orderNotes', 'Order Notes')} ({t('optional', 'Optional')})
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder={t('orderNotesPlaceholder', 'Any special instructions for your order?')}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t('orderSummary', 'Order Summary')}
                </h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product.image_url ? (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-primary-300 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity} × {formatCurrency(item.product.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('subtotal', 'Subtotal')}</span>
                  <span className="font-semibold">{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>{t('tax', 'Tax')}</span>
                  <span className="font-semibold">{formatCurrency(getTax())}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>{t('total', 'Total')}</span>
                  <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(getTotal())}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading || items.length === 0}
                className="w-full mt-6 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>{t('placingOrder', 'Placing Order...')}</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>{t('placeOrder', 'Place Order')}</span>
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                {t('checkoutNotice', 'Your order will be processed and you will receive a confirmation email.')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
