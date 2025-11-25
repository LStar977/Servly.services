# Servly - Service Marketplace Platform

## Overview

Servly is a full-stack service marketplace platform that connects customers with verified local service providers. The platform enables customers to discover, book, and pay for services while providing service providers with tools to manage their business operations, bookings, and customer relationships.

The application is built as a modern web application with a React frontend and Express backend, using PostgreSQL for data persistence. It features separate user flows for customers, service providers, and administrators, with integrated payment processing, messaging, and booking management capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**Design System:**
- Custom color palette with blue-focused theme for trust and professionalism
- Two font families: Inter for body text, Outfit for headings
- Consistent spacing, shadows, and border radius through CSS variables
- Dark mode support through CSS custom properties

**State Management:**
- Authentication state managed through React Context (AuthProvider)
- Server data cached and synchronized via TanStack Query
- Local component state with React hooks

**Component Architecture:**
- Atomic design pattern with reusable UI components in `/client/src/components/ui`
- Page-level components in `/client/src/pages`
- Shared business logic components (Layout, AIAssistChat, DocumentUpload)

### Backend Architecture

**Technology Stack:**
- Node.js with Express framework
- TypeScript for type safety across the stack
- Drizzle ORM for database operations
- PostgreSQL (Neon serverless) as the primary database

**API Design:**
- RESTful API endpoints under `/api` prefix
- Session-based authentication with express-session
- PostgreSQL-backed session store for persistence
- Request/response logging middleware

**Authentication & Authorization:**
- Dual authentication system:
  1. OAuth via Replit Authentication (using OpenID Connect)
  2. Traditional email/password with bcrypt hashing
- Role-based access control (customer, provider, admin)
- Session management with configurable TTL (7 days default)
- Secure cookie configuration with httpOnly and sameSite flags

**Data Layer (Storage Pattern):**
- Repository pattern implementation in `server/storage.ts`
- Interface-based design (IStorage) for testability and flexibility
- Drizzle ORM for type-safe database queries
- Shared schema definitions in `/shared/schema.ts` for type consistency

### Database Schema

**Core Tables:**
- `users`: User accounts with role-based access (customer/provider/admin)
- `provider_profiles`: Extended business information for service providers
- `services`: Individual services offered by providers
- `categories`: Service categories for classification
- `bookings`: Customer service appointments with status tracking
- `payments`: Payment records linked to Stripe
- `payouts`: Provider payout tracking
- `reviews`: Customer feedback and ratings
- `messages`: In-platform messaging system
- `conversations`: Message thread management
- `notification_preferences`: User notification settings
- `notifications`: System notifications log
- `documents`: Provider verification documents
- `sessions`: Server-side session storage
- `platforms`: Multi-region platform configuration
- `waitlist`: Pre-launch email collection

**Key Design Decisions:**
- UUIDs for primary keys (using PostgreSQL's gen_random_uuid())
- Timestamps for audit trails (createdAt, updatedAt)
- JSONB fields for flexible data storage where needed
- Indexes on frequently queried fields (session expiration, user lookups)

### External Dependencies

**Payment Processing:**
- Stripe integration for payment processing
- Stripe API version: 2024-12-18
- Payment intents for secure transaction handling
- Webhook support for payment status updates

**Email Service:**
- Nodemailer for transactional emails
- Gmail SMTP configuration
- Welcome emails on user registration
- Booking confirmation notifications
- Graceful degradation when email credentials not configured

**Database Hosting:**
- Neon serverless PostgreSQL
- Connection pooling via @neondatabase/serverless
- Environment-based connection string configuration

**Authentication:**
- Replit OAuth (OpenID Connect) for seamless Replit integration
- openid-client for OAuth flow handling
- Passport.js strategy integration
- Support for custom identity providers

**File Storage:**
- Supabase for document and image storage
- Base64 encoding for temporary document handling
- Public URL generation for stored assets

**Third-Party UI Libraries:**
- Radix UI for accessible component primitives
- Lucide React for iconography
- QRCode.react for 2FA QR code generation
- Embla Carousel for image carousels
- React Hook Form with Zod validation

**Development Tools:**
- Replit-specific Vite plugins:
  - Runtime error modal overlay
  - Cartographer for code navigation
  - Development banner
- TypeScript compilation with incremental builds
- ESBuild for production server bundling

**Location Services:**
- Mock Canadian cities data for MVP
- Designed for future integration with geocoding APIs

### Key Architectural Decisions

**Monorepo Structure:**
- Single repository with clear separation: `/client`, `/server`, `/shared`
- Shared TypeScript types between frontend and backend via `/shared` directory
- Path aliases for clean imports (@/, @shared/, @assets/)
- Reduces duplication and ensures type consistency across the stack

**Build & Deployment:**
- Separate development and production build processes
- Vite for frontend bundling with code splitting
- ESBuild for backend compilation to ESM
- Static asset serving in production via Express
- Development mode uses Vite's HMR for fast iteration

**Multi-Role User System:**
- Single users table with role discrimination
- Extended provider_profiles table for business-specific data
- Conditional UI rendering based on user role
- Separate dashboard routes per role (customer, provider, admin)
- Provider verification workflow with document uploads

**Booking Flow:**
- Service discovery → Provider selection → Time slot booking → Payment
- Calendar-based availability system with time slot management
- Status progression: pending → confirmed → completed → cancelled
- Integration with payment status for automatic confirmation

**Messaging System:**
- Conversation-based architecture for organized communication
- Support for both customer-provider and provider-customer messaging
- Unread message tracking
- Real-time-ready design (prepared for WebSocket integration)

**Provider Verification:**
- Multi-stage verification process:
  1. Identity verification (government ID)
  2. Business registration verification
  3. Professional licenses/certifications
  4. Insurance documentation
- Document upload with categorization
- Admin approval workflow
- Verification badge display in provider listings

**Scalability Considerations:**
- Stateless session design (stored in database, not memory)
- Prepared for horizontal scaling
- Database connection pooling
- Memoization for expensive operations (OAuth config)
- Query result caching via TanStack Query

**Error Handling:**
- Graceful degradation for optional services (email)
- Try-catch blocks with user-friendly error messages
- Toast notifications for user feedback
- Comprehensive logging for debugging

**Security Measures:**
- Password hashing with bcrypt (10 rounds)
- SQL injection prevention via parameterized queries (Drizzle ORM)
- XSS protection through React's automatic escaping
- CSRF protection via sameSite cookie configuration
- Environment variable validation on startup
- Secure session cookies (httpOnly, secure in production)