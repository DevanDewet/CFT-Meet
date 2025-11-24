# CFT-Meet

A meeting room management system that allows users to create, view, edit, and delete meeting rooms, as well as manage bookings for meetings and gatherings.

- **Room Management**: Create, view, edit, and delete meeting rooms with capacity and features
- **Booking System**: Schedule, view, edit, and cancel meeting bookings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

**Frontend:**
- Vue 3 (Composition API)
- Vuetify 3
- Vue Router
- Axios
- Vite

**Backend:**
- Node.js
- Express.js 5.1.0
- CORS

## Prerequisites

Before running the application, ensure you have the following installed:
- **Node.js** 
- **npm** 

##  How to Run Both Apps

### 1. Clone the Repository
git clone https://github.com/DevanDewet/CFT-Meet.git
cd CFT-Meet

### 2. Backend Setup

# Navigate to the backend folder
cd cft-meet/backend

# Install dependencies
npm install

# Start the backend server
npm start

The backend server will run on `http://localhost:3000`

### 3. Frontend Setup

Open a **new terminal window/tab** and run:

# Navigate to the frontend folder from the project root
cd cft-meet/frontend

# Install dependencies
npm install

# Start the development server
npm run dev

Open your browser and navigate to `http://localhost:5173`

### Architecture
The application follows a **client-server architecture** with a clear separation of concerns:

- **Frontend (Vue 3 SPA)**: Provides an interactive user interface using Vue 3's Composition API and Vuetify components
- **Backend (Express REST API)**: Handles data persistence and business logic with RESTful endpoints
- **Communication**: Axios client makes HTTP requests to the Express server using a REST API

### Key Design Decisions

1. **Composition API**: Used Vue 3's Composition API with `<script setup>` for cleaner, more maintainable code
2. **Component Architecture**: Created reusable components (RoomCard, BookingCard, dialogs) for consistency
3. **Responsive Design**: Implemented mobile-first design using Vuetify's breakpoint system
   - Desktop: Dialog overlays for forms
   - Mobile: Full-screen pages for better UX
4. **REST API**: Standard RESTful endpoints with proper HTTP methods (GET, POST, PUT, DELETE)
5. **State Management**: Simple reactive state using Vue's `ref()` 
6. **Routing**: Vue Router for navigation with query parameters for deep linking (e.g., pre-selecting rooms when booking)

### API Endpoints

**Rooms:**
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

**Bookings:**
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking

### Features Implementation

**Dashboard:**
- Real-time analytics calculated from rooms and bookings data
- Upcoming bookings list (next 7 days)

**Room Management:**
- CRUD operations with validation
- Room features stored as arrays
- Edit functionality with pre-populated forms
- Delete confirmation dialogs

**Booking System:**
- Date and time selection with validation
- Room selection dropdown with capacity display
- Edit bookings with all fields pre-filled
- Status indicators (upcoming/ongoing/completed)
- Detailed view dialog for full booking information

## Development Time

**Total Time Spent: ~10 hours**

Breakdown:
- Initial setup and project structure: ~1 hour
- Backend API implementation: ~1.5 hours
- Frontend components and views: ~4 hours
- Styling and responsive design: ~1.5 hours
- Dashboard analytics: ~1 hour
- Testing and bug fixes: ~1 hour



