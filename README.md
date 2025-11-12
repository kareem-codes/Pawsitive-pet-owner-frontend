# 🐾 Pawsitive Systems - Owner Portal

<div align="center">

![Pawsitive Systems](https://img.shields.io/badge/Pawsitive-Systems-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Modern Customer Portal for Veterinary Clinic Management**

[Features](#-features) • [Getting Started](#-getting-started) • [Tech Stack](#-tech-stack) • [Documentation](#-documentation)

</div>

---

## 📋 Overview

Pawsitive Systems Owner Portal is a modern, feature-rich web application designed for pet owners to manage their pets' healthcare, appointments, medical records, and more. Built with Next.js 14 and TypeScript, it provides a seamless and intuitive experience for veterinary clinic customers.

## ✨ Features

### 🏥 Core Functionality
- **Pet Management** - Add, edit, and manage multiple pets with detailed profiles
- **Appointment Scheduling** - Book, reschedule, and manage veterinary appointments
- **Medical Records** - Access your pets' complete medical history and treatment records
- **Invoice Management** - View and manage billing and payment history
- **Shop Integration** - Browse and purchase pet products and services

### 🎨 User Experience
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Dark/Light Mode** - Customizable theme preferences with smooth transitions
- **Multi-language Support** - Available in English and Arabic (RTL support)
- **Real-time Notifications** - Stay updated with appointment reminders and updates
- **Advanced Filtering & Sorting** - Powerful data tables with search and filter capabilities

### 🔐 Security & Authentication
- **Secure Authentication** - JWT-based authentication system
- **Protected Routes** - Role-based access control
- **Session Management** - Automatic token refresh and secure logout

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/kareem-codes/pawsitive-owner-portal.git
cd pawsitive-owner-portal
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Pawsitive Systems
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3001](http://localhost:3001)

### Build for Production

```bash
npm run build
npm run start
```

## 🛠 Tech Stack

### Frontend Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18.3](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### State Management & Forms
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation

### Data & API
- **[Axios](https://axios-http.com/)** - HTTP client
- **[date-fns](https://date-fns.org/)** - Modern date utility library
- **[Recharts](https://recharts.org/)** - Composable charting library

### Developer Experience
- **[React Hot Toast](https://react-hot-toast.com/)** - Toast notifications
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
react-owner-front/
├── app/                      # Next.js App Router pages
│   ├── auth/                # Authentication pages (login, register)
│   ├── dashboard/           # Dashboard and main features
│   │   ├── appointments/    # Appointment management
│   │   ├── invoices/        # Invoice history
│   │   ├── medical-records/ # Medical records
│   │   ├── pets/            # Pet management
│   │   └── profile/         # User profile
│   ├── shop/                # E-commerce integration
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # Reusable React components
│   ├── DashboardLayout.tsx  # Dashboard wrapper
│   ├── SortableTable.tsx    # Data table component
│   └── ...
├── lib/                     # Utility functions
│   ├── api-client.ts        # API client configuration
│   └── utils.ts             # Helper functions
├── services/                # API service layers
│   ├── auth.service.ts
│   ├── pet.service.ts
│   └── ...
├── stores/                  # Zustand state stores
│   ├── cart.ts
│   └── notificationStore.ts
├── types/                   # TypeScript type definitions
│   └── index.ts
└── locales/                 # Internationalization
    ├── en.json
    └── ar.json
```

## 🌐 API Integration

The application connects to the Pawsitive Systems backend API. Configure the API endpoint in your environment variables:

```env
NEXT_PUBLIC_API_URL=https://api.pawsitive-systems.com/api/v1
```

### API Services

- **Authentication** - User login, registration, password reset
- **Pet Management** - CRUD operations for pet profiles
- **Appointments** - Scheduling and management
- **Medical Records** - Viewing treatment history
- **Invoices** - Billing and payment information
- **Products** - E-commerce functionality

## 🎨 Theming & Customization

The application supports extensive theming capabilities:

- **Light/Dark Mode** - Toggle between themes
- **Custom Color Schemes** - Configurable via Tailwind CSS
- **RTL Support** - Full right-to-left layout for Arabic language

## 🌍 Internationalization

Multi-language support with easy extensibility:

- **English** (en)
- **Arabic** (ar) with RTL support

Add new languages by creating translation files in the `locales/` directory.

## 📱 Responsive Design

Fully responsive across all device sizes:
- 📱 Mobile (320px and up)
- 📱 Tablet (768px and up)
- 💻 Desktop (1024px and up)
- 🖥️ Large Desktop (1440px and up)

## 🧪 Scripts

```bash
npm run dev          # Start development server on port 3001
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software for Pawsitive Systems.

## 👥 Support

For support, please contact:
- **Email**: support@pawsitive-systems.com
- **Documentation**: [docs.pawsitive-systems.com](https://docs.pawsitive-systems.com)

---

<div align="center">

**Made with ❤️ by the Pawsitive Systems Team**

</div>
