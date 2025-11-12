"use client"

import { useState, useEffect } from 'react'
import { useI18n } from '@/components/Providers'
import HeaderControls from '@/components/HeaderControls'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  ArrowRight,
  PawPrint,
  Eye,
  Star,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import { productService } from '@/services/product.service'
import { useCartStore } from '@/stores/cart'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ShopPage() {
  const { t } = useI18n()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const { items, addItem, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          productService.getCategories(),
        ])
        
        setProducts(productsData.data || [])
        setCategories(categoriesData)
      } catch (error) {
        console.log(error);
        
        toast.error(t('failedLoadProducts', 'Failed to load products'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const stock = product.stock_quantity || product.quantity_in_stock || 0
    return matchesSearch && matchesCategory && stock > 0
  })

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    e?.stopPropagation()
    addItem(product)
    toast.success(`${product.name} ${t('addedToCart', 'added to cart')}`)
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product)
  }

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error(t('cartEmpty', 'Your cart is empty'))
      return
    }
    toast.success(t('redirectingToCheckout', 'Redirecting to checkout...'))
    // TODO: Implement checkout flow
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl">
                <PawPrint className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                {t('siteTitle', 'Pawsitive Systems')}
              </span>
            </Link>
            <div className="flex items-center gap-4">
              <HeaderControls />
              <Link
                href="/auth/login"
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
              >
                {t('signIn', 'Sign In')}
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                    {items.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-1 pb-2">
            {t('shopPageTitle', 'Pet Products Store')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('shopPageSubtitle', 'Browse our selection of premium pet supplies')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="search"
                placeholder={t('searchProductsPlaceholder', 'Search products...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 shadow-sm transition-all"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="md:w-64">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full ps-12 pe-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 shadow-sm appearance-none cursor-pointer transition-all"
                dir="auto"
              >
                <option value="all">{t('allCategories', 'All Categories')}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {t(`category_${category}`, category)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full mb-6">
              <Package className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t('noProductsFound', 'No products found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your filters or search query'
                : 'Check back soon for new products!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const stock = product.stock_quantity || product.quantity_in_stock || 0
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                  onClick={() => handleViewProduct(product)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  {/* Product image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewProduct(product)
                          }}
                          className="flex-1 bg-white/90 hover:bg-white text-gray-900 py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          {t('viewDetails', 'View')}
                        </button>
                        <button
                          onClick={(e) => handleAddToCart(product, e)}
                          className="flex-1 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-2 px-3 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-all"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {t('addToCart', 'Add')}
                        </button>
                      </div>
                    </div>

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-xs font-semibold bg-white/95 dark:bg-gray-900/95 text-primary-600 dark:text-primary-400 rounded-full shadow-sm flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {product.category}
                      </span>
                    </div>
                    
                    {/* Stock badge */}
                    {stock < 10 && stock > 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2.5 py-1 text-xs font-semibold bg-orange-500/95 text-white rounded-full shadow-sm">
                          {t('onlyLeft', 'Only')} {stock}!
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {stock} {t('inStock', 'in stock')}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 top-0 bottom-0 right-0 left-0 m-auto md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-4xl md:max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
              
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 rounded-full shadow-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              </button>

              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl overflow-hidden">
                    {selectedProduct.image_url ? (
                      <img
                        src={selectedProduct.image_url}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-32 w-32 text-gray-300 dark:text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 text-sm font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full mb-3">
                        {selectedProduct.category}
                      </span>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {selectedProduct.name}
                      </h2>
                      {selectedProduct.sku && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          SKU: {selectedProduct.sku}
                        </p>
                      )}
                    </div>

                    {selectedProduct.description && (
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          {t('description', 'Description')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {selectedProduct.description}
                        </p>
                      </div>
                    )}

                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t('price', 'Price')}
                          </p>
                          <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                            {formatCurrency(selectedProduct.price)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {t('availability', 'Availability')}
                          </p>
                          <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {selectedProduct.stock_quantity || selectedProduct.quantity_in_stock || 0} {t('inStock', 'in stock')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto space-y-3">
                      <button
                        onClick={(e) => {
                          handleAddToCart(selectedProduct, e)
                          setSelectedProduct(null)
                        }}
                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                      >
                        <ShoppingCart className="h-6 w-6" />
                        {t('addToCart', 'Add to Cart')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shopping Cart Sidebar */}
      {cartOpen && (
        <>
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Cart header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-primary-500 to-purple-500 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t('shoppingCart', 'Shopping Cart')}
                  </h2>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full mb-6">
                    <ShoppingCart className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t('cartEmpty', 'Your cart is empty')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Start adding products to your cart!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-md transition-shadow"
                    >
                      <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-600 dark:to-gray-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-primary-300 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-3">
                          {formatCurrency(item.product.price)}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                            className="p-1.5 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                          >
                            <Minus className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                          </button>
                          <span className="px-4 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg font-semibold text-gray-900 dark:text-gray-100 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 rounded-lg bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors"
                          >
                            <Plus className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ms-auto p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{t('subtotal', 'Subtotal')}</span>
                    <span className="font-semibold">{formatCurrency(getTotal())}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100">
                    <span>{t('total', 'Total')}</span>
                    <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(getTotal())}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-4 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl mb-3"
                >
                  {t('proceedToCheckout', 'Proceed to Checkout')}
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-3 rounded-xl transition-colors"
                >
                  {t('clearCart', 'Clear Cart')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}
