# Confetti and Carousel Event Booking System

A full-featured event booking system for Confetti and Carousel, a luxury event planning and decoration company.

## Features

- **User Account Creation**: Clients can create accounts to manage their bookings and profile information
- **Event Booking**: Easily book events with detailed information including:
  - Event type (Wedding, Corporate, Birthday, etc.)
  - Date and time
  - Venue details
  - Guest count
  - Product preferences
- **Product Catalog**: Browse products available for event decoration and setup
- **Package Selection**: Choose from predefined packages or request custom options
- **Client Management**: Store and manage client information securely
- **Event Management**: Track all event details including timeline, staff assignments, and tasks

## Technical Stack

- **Frontend**: Vue.js with Nuxt
- **Backend**: Nuxt server endpoints
- **Database**: PostgreSQL
- **ORM**: Prisma

## Database Schema

The system uses a comprehensive database schema with the following main entities:

- **Accounts**: User authentication and role management
- **Clients**: Client contact information and details
- **Events**: Comprehensive event information
- **Products**: Inventory of products available for events
- **Staff**: Team member information and assignments
- **Tasks**: Tasks associated with event planning and execution
- **Event Pipeline**: Workflow stages for each event

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="postgresql://postgres:CaC.Db.25.PH!@194.213.3.37:3335/postgres"
   ```
4. Generate Prisma client:
   ```
   npx prisma generate
   ```
5. Run the development server:
   ```
   npm run dev
   ```

## GitHub Deployment

This project is configured to automatically deploy when changes are pushed to the main branch:

1. Push your changes to the main branch:
   ```
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. GitHub Actions will automatically build and deploy the site to GitHub Pages.

3. To set up the required secrets for deployment:
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `DATABASE_URL`
     - `JWT_SECRET`
     - `INSTAGRAM_ACCESS_TOKEN`
     - `INSTAGRAM_USER_ID`

## API Endpoints

### Accounts
- `GET /api/accounts`: List all accounts
- `POST /api/accounts`: Create a new account

### Clients
- `GET /api/clients`: List all clients
- `POST /api/clients`: Create a new client

### Events
- `GET /api/events`: List all events
- `POST /api/events`: Create a new event
- `GET /api/events/:id`: Get event details
- `PUT /api/events/:id`: Update event
- `DELETE /api/events/:id`: Delete event

### Products
- `GET /api/products`: List all products

## User Workflow

1. User creates an account
2. User provides client information
3. User selects products and specifies event details
4. System creates the booking in the database
5. Admin staff can view and manage the booking

## License

All rights reserved. This project is proprietary software.
