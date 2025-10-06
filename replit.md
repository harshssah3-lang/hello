# Royal Academy School Management System

## Overview

Royal Academy is a comprehensive school management web application built with React, TypeScript, and Vite. The system serves multiple user roles (Principal, Teachers, Students) and provides features for managing admissions, faculty, courses, galleries, announcements, and more. The application uses Supabase as its backend database with localStorage as a fallback for offline functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18.3.1** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot-module replacement
- **React Router** for client-side routing with protected routes for authenticated users

**UI Framework & Styling**
- **Tailwind CSS** with custom theme extending base colors (royal, crimson, gold palettes)
- **shadcn/ui** component library built on Radix UI primitives for accessible components
- **Framer Motion** for animations and transitions throughout the application
- **next-themes** for dark/light mode theming

**State Management & Data Flow**
- Component-level state using React hooks (useState, useEffect)
- No global state management library - relies on localStorage and Supabase for persistence
- Custom hooks in `/src/hooks` directory (use-mobile, use-toast)

**Key Design Patterns**
- Protected routes using `ProtectedRoute` component that checks localStorage auth keys
- Manager components (TeacherManager, GalleryManager, etc.) follow a consistent CRUD pattern
- Dual persistence strategy: writes to both Supabase and localStorage simultaneously
- Realtime subscriptions for live data updates across browser tabs/sessions

### Backend Architecture

**Database & Storage**
- **Supabase** as the primary backend service
- Single table schema: `app_state` with key-value pairs (key: string, value: JSON)
- No traditional relational schema - all data stored as JSON in the value column
- Supabase Realtime used for cross-tab synchronization

**Data Persistence Strategy**
- `supaStorage.ts` implements a localStorage shim with Supabase backing
- Writes go to localStorage first (immediate), then asynchronously to Supabase
- Reads check localStorage first, fall back to Supabase on cache miss
- Sensitive auth keys (teacher/student credentials) excluded from cross-port sync

**Authentication Mechanism**
- Simple localStorage-based authentication (no JWT or session tokens)
- Auth keys: `principalAuth`, `teacherAuth`, `studentAuth`
- Protected routes check for these boolean flags in localStorage
- Teacher/student profiles stored with username/password in localStorage

### Data Architecture

**Key localStorage/Supabase Keys**
- `royal-academy-homepage` - Homepage editor data
- `royal-academy-about` - About page content
- `royal-academy-admissions` - Admissions form submissions
- `royal-academy-teachers` - Faculty directory with departments
- `royal-academy-auth-teachers` - Teacher login credentials
- `royal-academy-students` - Student profiles and enrollment
- `royal-academy-gallery` - Photo galleries with categories
- `royal-academy-announcements` - School announcements
- `royal-academy-courses` - Course catalog
- `royal-academy-top-scorers` - Student achievements
- `royal-academy-pricing` - Tuition pricing (monthly/yearly)
- `royal-academy-academics` - Academics page content (departments, achievements)
- `royal-academy-facilities` - Facilities page content (facilities, stats)
- `royal-academy-audio-messages` - Principal audio messages with base64 audio data
- `royal-academy-yearly-books` - Yearly book recommendations by class and academic year

**Data Flow**
1. User action triggers state update in React component
2. Component calls `setSupabaseData()` or `supaStorage` method
3. Data written to localStorage immediately (synchronous)
4. Supabase write queued (asynchronous)
5. Realtime subscription broadcasts change to other tabs
6. Other tabs update their localStorage and re-render

### External Dependencies

**Core Libraries**
- `@supabase/supabase-js` (v2.58.0) - Backend database client
- `@tanstack/react-query` (v5.83.0) - Server state management (minimally used)
- `framer-motion` (v11.18.2) - Animation library
- `react-router-dom` - Client-side routing

**UI Component Libraries**
- `@radix-ui/*` - Headless UI primitives (accordion, dialog, dropdown, etc.)
- `lucide-react` (v0.462.0) - Icon library
- `class-variance-authority` & `clsx` - Utility for conditional classNames

**Form & Validation**
- `@hookform/resolvers` (v3.10.0) - Form validation
- `react-hook-form` - Form state management (implied by resolvers)
- `zod` - Schema validation (implied by resolvers)

**Payment Integrations** (declared but not actively used)
- Razorpay, PayPal, Stripe SDKs loaded in index.html
- Payment processing code exists in Admissions page but requires API keys

**Development Tools**
- ESLint with TypeScript support
- TypeScript strict mode disabled for flexibility
- Path aliases configured (@/ maps to ./src/)

**Hosting & Deployment**
- Vercel configuration (vercel.json) with SPA rewrite rules
- Static site deployment with client-side routing fallback

## Recent Changes

### Performance Optimizations (October 2025)
**Console Warnings & Errors Fixed:**
- ✅ Removed Supabase environment variable warning from console
- ✅ Added React Router v7 future flags (v7_startTransition, v7_relativeSplatPath) to eliminate warnings
- ✅ Fixed blank screen issue by adding instant body background color (#0d1017)
- ✅ Optimized all route animations from 0.4s to 0.15s for 2.6x faster page transitions
- ✅ Removed vertical slide animations (y: 20) to use only fade effects for smoother performance
- ✅ Removed initial animation delay on homepage for instant display
- ✅ Fixed 400 errors by removing unconfigured payment gateway scripts (Razorpay, PayPal, Stripe)
- ✅ Fixed 404 errors by adding proper favicon link to index.html
- ✅ Console now completely clean with zero errors or warnings

**Speed & Performance Improvements:**
- Ultra-fast page transitions (150ms instead of 400ms)
- Instant background rendering (no blank/gradient screen on load)
- Optimized animations for mobile devices (200ms max on mobile)
- Real-time updates optimized with Supabase subscriptions
- Clean console output for production deployment

### Authentication & Real-time Updates (October 2025)
**Authentication Persistence:**
- Fixed logout issue by removing redundant auth checks from dashboards
- ProtectedRoute now handles all authentication, preventing conflicts
- Auth persists correctly across browser refreshes

**Real-time Fee Management:**
- Added Supabase subscriptions for fee-records and payment-requests in StudentDashboard
- TeacherDashboard now writes to Supabase for instant cross-client sync
- Student payment processing syncs in real-time across all devices
- All fee updates appear instantly without page refresh

**Mobile Responsiveness:**
- Optimized Student Dashboard for 375x849 (iPhone) screen size
- Reduced padding and spacing for mobile (px-3 sm:px-6, py-4 sm:py-8)
- Responsive text sizes and icon scaling
- All modals optimized with proper mobile padding and heights

### Audio Messaging System (October 2025)
Added comprehensive audio messaging feature for Principal-to-Student/Teacher communication:

**Features:**
- Audio recording via browser MediaRecorder API or file upload
- Multi-tier recipient selection:
  - Whole school (all teachers and students)
  - All teachers or all students
  - Specific class (all students in that class)
  - Specific section (all students in class + section)
  - Individual student or teacher
- Playback controls with adjustable speed (0.5x to 2x)
- Message deletion capability
- Real-time synchronization via Supabase

**Technical Implementation:**
- Component: `AudioMessageManager.tsx`
- Storage: Audio files encoded as base64 and stored in Supabase (following existing binary data pattern)
- Integration: Quick action button in Principal Dashboard
- Data key: `royal-academy-audio-messages`

**Note:** Audio files are stored as base64-encoded strings in JSON, consistent with how the application handles all binary data (images, documents). This approach ensures compatibility with the existing key-value storage architecture.

### Content Management Systems
Added Academics and Facilities page managers in Principal Dashboard:

**AcademicsManager:**
- Manage academic departments with descriptions
- Track student achievements and milestones
- Full CRUD operations with Supabase sync

**FacilitiesManager:**
- Manage school facilities with images and descriptions
- Track facility statistics (library books, labs, sports facilities)
- Full CRUD operations with Supabase sync

### Homepage Animation Improvements (October 2025)
**Hero Banner Animation Fix:**
- ✅ Fixed bulky/broken animations by migrating from standard HTML elements to framer-motion components
- ✅ Converted all animated elements to motion primitives (motion.span, motion.p, motion.div)
- ✅ Optimized animation timing: 10px vertical slide with 0.4-0.5s duration and easeOut easing
- ✅ Implemented professional staggered entrance animations (0.1s between elements)
- ✅ Animations now complete in under 1 second for smooth user experience
- Component updated: Hero.tsx with proper framer-motion implementation

### Dashboard Mobile Responsiveness (October 2025)
**375px Mobile Optimization - Student & Teacher Dashboards:**

**Student Dashboard:**
- ✅ Comprehensive mobile-first responsive design for all dashboard components
- ✅ Header & navigation with compact mobile layout (h-9 w-9 buttons)
- ✅ Notifications dropdown with full-width mobile view (w-[calc(100vw-1.5rem)])
- ✅ Responsive text sizing throughout (text-xs sm:text-sm, text-sm sm:text-base)
- ✅ Mobile-optimized modals: Attendance (compact calendar), Payment (2-column grid), Grades, Assignments, Remarks
- ✅ Touch-friendly interactive elements with 44px minimum touch targets
- ✅ Consistent mobile padding pattern (px-3 sm:px-6, py-4 sm:py-8)
- ✅ No horizontal scrolling or layout breaks at 375px width
- ✅ All features fully functional on mobile devices

**Teacher Dashboard:**
- ✅ Navigation tabs with responsive wrapping and compact mobile buttons (h-9 px-2 sm:px-3)
- ✅ Hidden tab labels on mobile (hidden sm:inline) to save space
- ✅ Homework section with mobile-friendly cards and modals
- ✅ Student creation form with responsive grid layout (grid-cols-1 sm:grid-cols-2)
- ✅ Attendance, fee management, and remarks sections fully responsive
- ✅ All forms and inputs optimized for mobile (h-9 sm:h-10)
- ✅ Consistent responsive text sizing (text-xs sm:text-sm) throughout
- ✅ Touch-friendly buttons and interactive elements
- ✅ No horizontal scrolling at 375px width

### Book Management System (October 2025)
**Yearly Book Manager - Data Structure:**
- ✅ Created YearlyBook interface with comprehensive fields:
  * id, class (1-12), year, title, author, description, buying_link, createdAt
- ✅ CRUD helper functions in `src/lib/booksHelper.ts`
- ✅ Filtering capabilities: by class, by year, by class and year
- ✅ Follows existing localStorage + Supabase key-value storage pattern
- ✅ Storage key: `royal-academy-yearly-books`
- ✅ Full JSDoc documentation on all functions and interfaces

**Yearly Book Manager - UI Component:**
- ✅ Created YearlyBookManager component in Principal Dashboard
- ✅ Full CRUD operations: add, edit, delete, view books
- ✅ Form validation: required fields, class range 1-12, URL validation, academic year format
- ✅ Filtering by class and academic year
- ✅ Mobile responsive design following existing patterns
- ✅ Modal dialogs with Framer Motion animations
- ✅ Success/error notifications using toast
- ✅ Integrated in Content Management section of Principal Dashboard
- Component: `src/components/YearlyBookManager.tsx`

**Yearly Book Public Page:**
- ✅ Created YearlyBook.tsx public page for students/parents
- ✅ Displays books organized by class (1-12) with filtering options
- ✅ Shows book details: title, author, description, year, and "Buy Now" button
- ✅ Added route at `/yearly-book` in App.tsx
- ✅ Added "Yearly Book" to navigation menu (hamburger and desktop)
- ✅ Mobile responsive following existing page patterns (About, Courses)
- ✅ No authentication required - accessible to all users
- Page: `src/pages/YearlyBook.tsx`

### Exam Routine Management System (October 2025)
**Exam Routine Manager - Data Structure:**
- ✅ Created ExamRoutine interface with comprehensive fields:
  * id, date, exam_name, class, section, is_holiday, notes, createdAt
- ✅ CRUD helper functions in `src/lib/examRoutinesHelper.ts`
- ✅ Advanced filtering: by class/section, date range, month, specific date
- ✅ Separate queries for holidays vs exams
- ✅ Upcoming exams with sorting capabilities
- ✅ Follows existing localStorage + Supabase key-value storage pattern
- ✅ Storage key: `royal-academy-exam-routines`
- ✅ Full JSDoc documentation on all functions and interfaces