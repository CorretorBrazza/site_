# Abiatar Residence Tower - Real Estate Landing Page

## Overview

This is a modern, mobile-first real estate landing page for Abiatar Residence Tower, a residential property in Taboão da Serra, Brazil. The application is a single-page website designed to showcase apartment listings (1 and 2 bedroom units) with a focus on visual storytelling, comprehensive property information, and immediate WhatsApp contact integration.

The project is built as a full-stack TypeScript application with a React frontend and Express backend, though the current implementation is primarily frontend-focused with minimal backend functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for lightweight client-side routing (currently single route)
- Single-page application architecture with component-based design

**UI Component System:**
- Shadcn/ui component library (New York style variant)
- Radix UI primitives for accessible, unstyled components
- Tailwind CSS for utility-first styling with custom design system
- CSS variables for theming (light/dark mode support configured)

**Styling Approach:**
- Mobile-first responsive design (breakpoints: mobile <768px, tablet 768px+, desktop 1024px+)
- Custom Tailwind configuration with extended color system using HSL color space
- Design guidelines reference premium real estate sites (Airbnb, Zillow, QuintoAndar)
- Typography system using Inter/Nunito from Google Fonts
- Consistent spacing system using Tailwind units (4, 6, 8, 12, 16, 20, 24)

**State Management:**
- TanStack Query (React Query) v5 for server state management
- React hooks for local component state
- Custom hooks for responsive behavior (use-mobile, use-toast)

**Asset Management:**
- Static assets stored in `attached_assets/` directory
- Vite alias configuration for clean imports (@assets)
- Image assets for property photos, floor plans, and branding

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- ES modules (type: "module" in package.json)
- Custom Vite integration for development server with HMR
- Structured route registration system (currently minimal routes)

**API Design:**
- RESTful API structure with `/api` prefix convention
- JSON request/response format
- Request logging middleware with response capture
- Raw body parsing for webhook support

**Development Setup:**
- Development mode uses tsx for TypeScript execution
- Production build uses esbuild for server bundling
- Separate client and server build outputs

### Data Storage

**Database Technology:**
- PostgreSQL via Neon serverless driver (@neondatabase/serverless)
- Drizzle ORM for type-safe database operations
- Schema-first approach with Drizzle migrations

**Current Schema:**
- Simple user table with username/password (authentication foundation)
- UUID primary keys using PostgreSQL's gen_random_uuid()
- Zod integration for runtime validation via drizzle-zod

**Storage Interface:**
- Abstract IStorage interface for flexible data access
- MemStorage implementation for in-memory development/testing
- Database-backed storage ready for implementation

**Session Management:**
- connect-pg-simple configured for PostgreSQL session storage
- Session infrastructure prepared but not actively used

### Design System

**Component Patterns:**
- Compound component patterns from Radix UI
- Controlled/uncontrolled component flexibility
- Consistent API across UI components using class-variance-authority for variant management

**Accessibility:**
- ARIA attributes from Radix UI primitives
- Keyboard navigation support
- Screen reader considerations in component markup

**Responsive Behavior:**
- Mobile-first breakpoint system
- Custom hook (useIsMobile) for JavaScript-based responsive logic
- Conditional rendering for mobile/desktop variations

### External Dependencies

**Third-Party UI Libraries:**
- @radix-ui/* suite (20+ component primitives including accordion, dialog, dropdown, select, etc.)
- shadcn/ui component system
- embla-carousel-react for image galleries
- cmdk for command palette functionality
- lucide-react and react-icons for iconography

**Form Handling:**
- react-hook-form for form state management
- @hookform/resolvers for validation integration
- Zod for schema validation

**Styling & Utilities:**
- tailwindcss with autoprefixer
- class-variance-authority for component variants
- clsx and tailwind-merge for conditional class composition
- date-fns for date formatting

**Database & ORM:**
- @neondatabase/serverless (Neon PostgreSQL driver)
- drizzle-orm with PostgreSQL dialect
- drizzle-zod for schema validation
- drizzle-kit for migrations

**State Management:**
- @tanstack/react-query v5 for server state
- Custom query client configuration with infinite stale time

**Development Tools:**
- @replit/vite-plugin-* suite for Replit integration
- TypeScript strict mode enabled
- ESM module resolution with path aliases

**External Services:**
- WhatsApp Business API integration for contact (hardcoded number: 5511970988512)
- Google Fonts CDN for typography (Inter, Nunito)

**Notable Configuration:**
- Absolute imports configured via TypeScript paths (@/, @shared/, @assets/)
- Vite aliases matching TypeScript paths for consistent imports
- Custom Tailwind color system with CSS variable integration
- PostCSS with Tailwind and Autoprefixer