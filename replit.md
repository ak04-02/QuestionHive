# StackIt - Stack Overflow Clone

## Overview

StackIt is a full-stack Q&A platform similar to Stack Overflow, built with modern web technologies. The application allows users to ask questions, provide answers, vote on content, and participate in a community-driven knowledge sharing platform.

## User Preferences

Preferred communication style: Simple, everyday language.
Preferred build tool: Vite+React (Create React App is deprecated).

## Original Design Reference
The project follows wireframe designs provided by the user that show:
- Mobile-first responsive design with hamburger navigation
- Desktop layout with sidebar navigation and main content area  
- Question listing page with vote buttons, metadata, and tags
- Individual question view with answers and voting
- Ask Question page with rich text editor and tags input
- Search functionality with filters and popular tags integration

## System Architecture

### Frontend Architecture
The frontend is built using React 18 with TypeScript and follows a modern component-based architecture:

- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state management and React Context for authentication
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Extensive use of Radix UI primitives for accessibility

### Backend Architecture
The backend follows a RESTful API design with Express.js:

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Data Validation**: Zod schemas for runtime type validation

### Authentication System
Current implementation uses a demo authentication system:

- **Storage**: Client-side localStorage for user sessions
- **Demo Users**: Pre-configured test users (john_doe, alice_smith, mike_johnson)
- **Authorization**: Role-based access control (guest, user, admin)
- **Current Status**: Uses mock authentication for development/demo purposes

**Note**: The project has foundational Replit Auth components prepared but currently uses a simplified mock system for immediate demonstration. The database schema supports Replit Auth with string-based user IDs, but the storage layer still uses number-based IDs for compatibility.

## Key Components

### Database Schema
The application uses PostgreSQL with the following main entities:

- **Users**: Authentication and profile information with reputation system
- **Questions**: Core content with voting, view tracking, and tag support
- **Answers**: Responses to questions with voting and acceptance features
- **Votes**: Voting system for questions and answers
- **Tags**: Categorization system for questions

### API Structure
RESTful API endpoints organized by functionality:

- **Authentication**: `/api/auth/*` - Registration, login
- **Users**: `/api/users/*` - User profiles and management
- **Questions**: `/api/questions/*` - CRUD operations, search
- **Answers**: `/api/questions/:id/answers` - Answer management
- **Votes**: `/api/votes` - Voting system
- **Tags**: `/api/tags/*` - Tag management
- **Stats**: `/api/stats` - Platform statistics

### Frontend Pages
- **Home**: Question listing with search and filtering
- **Question Detail**: Individual question view with answers
- **Ask Question**: Question creation form
- **User Profile**: User information and activity
- **Authentication**: Login and registration forms
- **Admin Dashboard**: Administrative interface for platform management

## Data Flow

### Question Lifecycle
1. User creates question with title, content, and tags
2. Question stored in database with metadata (votes, views, answer count)
3. Other users can view, vote, and answer questions
4. Authors can accept answers, updating question status

### Voting System
1. Users can upvote or downvote questions and answers
2. Votes affect user reputation and content ranking
3. Vote counts updated in real-time through optimistic updates

### Search and Discovery
1. Users can search questions by title and content
2. Questions can be filtered by tags
3. Popular tags and recent activity displayed in sidebars

## External Dependencies

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Radix UI**: Unstyled, accessible UI primitives
- **Lucide React**: Icon library

### Development Tools
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **Drizzle Kit**: Database migrations and schema management

### Database and Infrastructure
- **Neon Database**: Serverless PostgreSQL provider
- **Drizzle ORM**: Type-safe database toolkit
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Build Process
1. Frontend built using Vite into static assets
2. Backend compiled using ESBuild for Node.js
3. Database migrations applied using Drizzle Kit

### Environment Configuration
- **Development**: Vite dev server with HMR and backend proxy
- **Production**: Static frontend served by Express.js backend
- **Database**: PostgreSQL connection via environment variable

### File Structure
- **Client**: React frontend in `/client` directory
- **Server**: Express backend in `/server` directory  
- **Shared**: Common types and schemas in `/shared` directory
- **Build Output**: Compiled assets in `/dist` directory

The application is designed to be deployed as a single Node.js application serving both the API and static frontend assets, making it suitable for platforms like Replit, Heroku, or similar hosting services.

## Recent Changes

### July 2025
- ✓ Added missing Tags and Users pages with search functionality
- ✓ Enhanced navigation with prominent "Ask Question" button in header and mobile menu
- ✓ Fixed routing issues - all referenced pages now exist and are accessible
- ✓ Improved button visibility across all screen sizes
- → Prepared foundational Replit Auth components (database schema, auth utilities)
- → Currently uses demo authentication system for immediate user testing
- → Database schema supports both number-based IDs (legacy) and string-based IDs (Replit Auth ready)

### Current Status
The project is fully functional with a mock authentication system that allows users to:
- View questions and answers as a guest
- Log in with demo credentials to post questions, answers, and vote
- Experience all features of the Q&A platform
- See role-based permissions in action

### Next Steps
- Complete migration to Replit Auth with database integration
- Resolve type consistency between storage layer and database schema
- Add real user registration and authentication flows