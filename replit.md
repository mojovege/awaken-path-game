# Awaken Path (覺悟之路) - Religious Cognitive Training Game

## Overview

Awaken Path is a cognitive training game specifically designed for middle-aged and elderly users (50+) to help prevent mental decline through religious-themed gameplay. The application combines meditation, memory training, reaction exercises, and logical thinking challenges while incorporating elements from Buddhism, Taoism, and Mazu worship. The game features an AI companion system that provides personalized guidance based on the user's chosen religious path, along with sharing capabilities to connect with family and friends.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite for fast development and optimized builds
- **UI System**: shadcn/ui components with Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom elderly-friendly design tokens featuring warm colors, large fonts, and high contrast
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management with local component state for UI interactions
- **Game State**: Custom hooks for managing game progression, scoring, and user interactions
- **Chapter System**: 5 chapters with 15 levels, progressive difficulty scaling based on user performance
- **Game Rules**: Comprehensive rules modal system with detailed instructions for each game type

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage**: Dual storage implementation with in-memory storage for development and PostgreSQL for production
- **API Design**: RESTful endpoints for user management, game progress tracking, statistics, and chat functionality
- **AI Integration**: OpenAI GPT-4 integration for generating personalized AI companion responses and game content

### Data Models
- **Users**: Profile management with religion selection, display names, and account creation tracking
- **Game Progress**: Individual game session results with scores, levels, and completion timestamps
- **User Statistics**: Aggregated cognitive training metrics across memory, reaction, logic, and focus categories
- **Story Progress**: Narrative advancement tracking with chapter completion and achievement systems
- **Chat Messages**: AI companion conversation history with persona-based responses

### Authentication and Session Management
- Simple user identification system with PostgreSQL session storage
- Demo user implementation for immediate access without registration barriers
- Religion-based personalization affecting AI interactions and game content

### Game Logic System
- **Chapter Structure**: 5-chapter progression system (初心啟蒙, 勤修精進, 智慧開悟, 深度修行, 圓滿境界)
- **Difficulty Scaling**: 15 levels with dynamic parameters - memory time (15-5s), reaction window (800-250ms), grid size (3-24), sequence length (2-15)
- **Scoring Algorithm**: Time-based scoring with difficulty multipliers and star rating system (1-3 stars per level)
- **Cognitive Categories**: Four main training areas (memory, reaction, logic, focus) with specialized mini-games
- **Adaptive Gameplay**: Hint system ranging from unlimited (early levels) to none (master levels), pause functionality
- **Unlock System**: Star-based chapter unlocking (6, 12, 18, 24 stars required)
- **Game Rules**: Interactive multi-page rules modal with game instructions, tips, and difficulty parameters

### AI Companion System
- **Religious Personas**: Three distinct AI characters based on Buddhism, Taoism, and Mazu worship
- **Contextual Responses**: AI responses incorporate user progress, health tips, and encouragement
- **Conversation History**: Persistent chat storage with user-specific message threading
- **Cultural Sensitivity**: Persona-specific language patterns and religious terminology integration

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL) for cloud-hosted data persistence
- **AI Services**: OpenAI API for natural language generation and game content creation
- **UI Components**: Radix UI for accessible component primitives
- **Styling**: Tailwind CSS for utility-first styling approach

### Development Tools
- **Build System**: Vite with React plugin for fast development and optimized production builds
- **Type Safety**: TypeScript with strict configuration for better code reliability
- **Database Migrations**: Drizzle Kit for schema management and database versioning
- **Code Quality**: ESLint configuration for consistent code standards

### Third-Party Libraries
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing
- **Date Management**: date-fns for localized date formatting and manipulation
- **Icons**: Lucide React for consistent iconography throughout the application
- **Carousel**: Embla Carousel for smooth image and content sliding experiences
- **Utilities**: clsx and tailwind-merge for conditional styling and class management