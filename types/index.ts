// User & Authentication Types
export interface User {
  id: number
  name: string
  email: string
  role?: string
  phone?: string
  avatar?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  created_at?: string
  updated_at?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// Owner Types
export interface Owner {
  id: number
  name: string
  email: string
  phone: string
  address?: string
  city?: string
  postal_code?: string
  emergency_contact?: string
  emergency_phone?: string
  pets?: Pet[]
  notes?: string
  created_at: string
  updated_at: string
}

// Pet Types
export interface Pet {
  id: number
  name: string
  species: string
  breed: string
  age?: number
  date_of_birth?: string
  weight?: number
  color?: string
  gender: 'male' | 'female'
  owner_id: number
  owner?: Owner
  medical_history?: string
  allergies?: string
  microchip_id?: string
  image_url?: string
  status: 'active' | 'inactive' | 'deceased'
  vaccinations?: Vaccination[]
  medical_records?: MedicalRecord[]
  weight_records?: WeightRecord[]
  created_at: string
  updated_at: string
}

// Appointment Types
export interface Appointment {
  id: number
  pet_id: number
  pet?: Pet
  owner_id: number
  owner?: Owner
  veterinarian_id?: number
  veterinarian?: User
  appointment_date: string
  appointment_time?: string
  duration_minutes?: number
  type?: string
  reason: string
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  notes?: string
  diagnosis?: string
  treatment?: string
  created_at: string
  updated_at: string
}

export interface AppointmentSlot {
  date: string
  time: string
  available: boolean
  veterinarian_id?: number
}

// Medical Record Types
export interface MedicalRecord {
  id: number
  pet_id: number
  pet?: Pet
  appointment_id?: number
  appointment?: Appointment
  veterinarian_id: number
  veterinarian?: User
  visit_date: string
  weight?: number
  temperature?: number
  diagnosis?: string
  treatment?: string
  prescriptions?: string
  procedures?: string
  notes?: string
  next_visit_date?: string
  symptoms?: string
  follow_up_date?: string
  attachments?: string[]
  vaccinations?: Vaccination[]
  created_at: string
  updated_at: string
}

// Vaccination Types
export interface Vaccination {
  id: number
  pet_id: number
  pet?: Pet
  medical_record_id?: number
  vaccine_name: string
  administered_date: string
  next_due_date?: string
  batch_number?: string
  veterinarian_id?: number
  veterinarian?: User
  notes?: string
  created_at: string
  updated_at: string
}

// Weight Record Types
export interface WeightRecord {
  id: number
  pet_id: number
  weight: number
  recorded_at: string
  notes?: string
  created_at: string
  updated_at: string
}

// Product Types
export interface Product {
  id: number
  name: string
  description?: string
  category: string
  sku: string
  barcode?: string
  price: number
  cost?: number
  cost_price?: number
  stock_quantity?: number
  quantity_in_stock: number
  min_stock_level: number
  reorder_threshold?: number
  unit?: string
  supplier?: string
  expiry_date?: string
  tax_percentage?: number
  tax_fixed?: number
  image_url?: string
  image?: string
  is_active?: boolean
  status: 'active' | 'inactive' | 'discontinued'
  created_at: string
  updated_at: string
}

// Invoice Types
export interface Invoice {
  id: number
  owner_id: number
  owner?: Owner
  pet_id?: number
  pet?: Pet
  invoice_number: string
  invoice_date: string
  due_date: string
  subtotal: number
  tax: number
  discount: number
  total: number
  amount_paid?: number
  balance?: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  items?: InvoiceItem[]
  payments?: Payment[]
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: number
  invoice_id: number
  product_id?: number
  product?: Product
  description: string
  quantity: number
  unit_price: number
  tax_percentage?: number
  tax_amount?: number
  total: number
  created_at: string
  updated_at: string
}

// Payment Types
export interface Payment {
  id: number
  invoice_id: number
  invoice?: Invoice
  payment_date: string
  amount: number
  payment_method: 'cash' | 'card' | 'bank_transfer'
  transaction_id?: string
  notes?: string
  created_at: string
  updated_at: string
}

// Communication Log Types
export interface CommunicationLog {
  id: number
  owner_id: number
  owner?: Owner
  pet_id?: number
  pet?: Pet
  type: 'email' | 'phone' | 'sms' | 'whatsapp'
  subject?: string
  message: string
  direction: 'inbound' | 'outbound'
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  created_at: string
  updated_at: string
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number
  to?: number
}

// Dashboard Stats
export interface DashboardStats {
  pets: {
    total: number
    active: number
  }
  appointments: {
    upcoming: number
    today: number
  }
  vaccinations: {
    due_soon: number
    overdue: number
  }
  invoices: {
    unpaid: number
    unpaid_amount: number
  }
}

// Cart Types (for product ordering)
export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
}

// Order Types
export interface Order {
  id: number
  owner_id: number
  order_number: string
  order_date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  subtotal: number
  tax: number
  shipping: number
  total: number
  items: OrderItem[]
  shipping_address?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product?: Product
  quantity: number
  price: number
  total: number
}
