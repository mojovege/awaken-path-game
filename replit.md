# Awaken Path (覺悟之路) - Religious Cognitive Training Game

## Overview

Awaken Path is a cognitive training game specifically designed for middle-aged and elderly users (50+) to help prevent mental decline through religious-themed gameplay. The application combines meditation, memory training, reaction exercises, and logical thinking challenges while incorporating elements from Buddhism, Taoism, and Mazu worship. The game features an AI companion system that provides personalized guidance based on the user's chosen religious path, along with sharing capabilities to connect with family and friends.

## Recent Updates (2025-08-08)

### Database Integration Complete
- **PostgreSQL Integration**: Successfully migrated from in-memory storage to Neon PostgreSQL database
- **Schema Implementation**: Added comprehensive database schema with proper relations for:
  - Users with religion selection and profile management
  - Game progress tracking with scores and completion timestamps  
  - User statistics aggregation across all cognitive training categories
  - Story progress with chapter completion and achievements
  - Chat message history with AI persona tracking
- **Storage Layer**: Implemented DatabaseStorage class replacing MemStorage with:
  - Full CRUD operations for all data models
  - Automatic user stats and story progress initialization
  - Proper foreign key relationships and data integrity
- **Database Relations**: Defined explicit relations between all tables using Drizzle ORM
- **Migration Success**: Schema successfully pushed to production database using `npm run db:push`
- **Connection Issues Resolved**: Fixed Neon PostgreSQL connection timeout issues by recreating database connection
- **User Management Fixed**: Resolved duplicate user creation and display name issues - new users now correctly show "新用戶"

### Major Bug Fixes Completed
- **Navigation Issues**: Fixed homepage return buttons in game containers with proper redirect logic
- **Memory Temple Game**: Corrected scoring calculation algorithm and target building identification
- **Reaction Lighting Game**: Fixed async/await syntax errors and improved error handling 
- **Religion Selection**: Enhanced API error handling and debug logging for faith selection
- **Dashboard Navigation**: Fixed "重新選擇信仰" button to properly clear localStorage and redirect
- **Game Timing Logic**: Verified all games follow replit.md specified time constraints
- **Logic Games**: Added comprehensive debug logging for scripture sorting and sequence games

### New Features Added (2025-08-08)
- **Learning Phase System**: Implemented study phase in scripture memory game showing concept-meaning pairs before card flipping
- **Comprehensive Hint System**: Added "顯示提示" buttons across all six game types:
  - **Memory Scripture**: Shows concept-meaning relationships during learning and gameplay
  - **Memory Temple**: Reveals target buildings during answering phase
  - **Reaction Rhythm**: Provides timing guidance and reaction window information
  - **Reaction Lighting**: Shows correct lamp sequence during input phase
  - **Logic Scripture**: Displays correct sequence order with numbered steps
  - **Logic Sequence**: Shows correct answers with pattern explanation
- **Multi-Religion Support**: All three religions (Buddhism, Taoism, Mazu) have complete content:
  - Distinct building names and emojis for each religion
  - Religion-specific concept-meaning pairs for memory games
  - Custom sequence patterns and scriptures for logic games
  - Appropriate audio and visual themes
- **Enhanced Game Instructions**: Added descriptive text matching design specifications
- **Story Integration Complete**: Comprehensive story system with 5 chapters per religion featuring thematic content
- **Audio Integration**: Religion-specific sound effects and background music for immersive gameplay

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
- **Chapter System**: 5 chapters with 6 games each (30 total games), progressive difficulty scaling and story-driven progression
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

### Game Logic System (Updated 2025-08-08)
- **Chapter Structure**: 5-chapter progression system with 6 games each (初心啟蒙, 勤修精進, 智慧開悟, 深度修行, 圓滿境界)
- **Game Types**: 6 distinct game types per chapter - memory-scripture, memory-temple, reaction-rhythm, reaction-lighting, logic-scripture, logic-sequence
- **Level Mapping**: Each game type represents levels 1-6 within current chapter, total 30 games (5 chapters × 6 games)
- **Task-Oriented Difficulty System**: Difficulty increases through complexity and time pressure, designed for elderly cognitive training
  - **Memory Parameters**: Level 1 (10s memory time) → Level 5 (4s memory time)
  - **Reaction Windows**: Level 1 (1000ms) → Level 5 (300ms)
  - **Element Quantity**: Level 1 (3 elements) → Level 5 (9 elements)
  - **Speed Multiplier**: Level 1 (1.0x) → Level 5 (2.5x)
  - **Game Duration**: Task-specific timing - memory games (记忆时间+15s作答), reaction games (20-35s), logic games (30-60s)
- **Audio Integration**: Contextual audio for immersion - Zen music for memory/logic games, wooden fish/drum sounds for rhythm games, fire lighting sounds for lamp games
- **Scoring Algorithm**: Task completion and accuracy-based scoring with star rating system (1-3 stars per level)
- **Chapter Unlocking**: Star-based progression (6, 12, 18, 24 stars required for chapters 2-5)
- **Story Integration**: Each chapter contains thematic story content that connects with all 6 game types
- **Religious Personalization**: Three distinct story paths with culturally appropriate game content for Buddhism, Taoism, and Mazu faith

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