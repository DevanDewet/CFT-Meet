## Assumptions Made

### User Management
- **Single user system**: Assumed no user authentication or authorization was needed. Any user can create, view, edit, or delete any room or booking.
- **No user ownership**: Bookings don't track who created them, as there's no user system.

### Booking Logic
- **Basic validation**: Assumed simple date/time validation was sufficient (end time after start time, no past dates).
- **No conflict detection on frontend**: The backend checks for booking conflicts, but the frontend doesn't prevent users from attempting conflicting bookings.
- **Room availability**: Assumed that showing which rooms are available at specific times was not a requirement.

### UI/UX
- **Modern browsers**: Assumed users are on modern browsers with ES6+ support.
- **Basic responsive design**: Assumed mobile and desktop were the primary targets (no tablet-specific optimizations).

## Tradeoffs

### Architecture Decisions

1. **In-memory vs Database**
   - **Chose**: In-memory storage
   - **Why**: Faster development, simpler setup, sufficient for demo
   - **Cost**: Data lost on restart

2. **Vue Composition API vs Options API**
   - **Chose**: Composition API with `<script setup>`
   - **Why**: More modern, better TypeScript support, cleaner code organization

3. **State Management**
   - **Chose**: Local component state with `ref()`
   - **Why**: Application state is simple , reduces complexity
   - **Cost**: Would need refactoring if app grows significantly

4. **Form Handling**
   - **Chose**: Dialog overlays on desktop, full-page on mobile
   - **Why**: Better UX - overlays work well on large screens, full-page better for mobile

**Client-side Routing**
   - **Chose**: Vue Router with query parameters for state passing
   - **Why**: Clean navigation, deep linking support, good UX

### Feature Tradeoffs

1. **Dashboard Analytics**
   - **Included**: Basic metrics and upcoming bookings
   - **Excluded**: Charts/graphs, historical trends, detailed reports
   - **Why**: Time constraints, core functionality was priority

2. **Booking Management**
   - **Included**: Full CRUD for bookings, status indicators
   - **Excluded**: Calendar view, recurring bookings, notifications
   - **Why**: Focused on meeting assignment requirements first

3. **Validation**
   - **Included**: Basic form validation, required fields, format checks
   - **Excluded**: Complex business rules, room capacity vs booking size, availability checking
   - **Why**: Time constraints, complexity vs value tradeoff

## What I Would Improve With More Time

### High Priority Improvements

1. **Database Integration**
   - Add PostgreSQL or MongoDB for persistent data storage
   - Implement proper data models and relationships
   - Add database migrations and seeding

2. **User Authentication & Authorization**
   - Implement JWT-based authentication
   - Add user roles (admin, regular user)
   - Track booking ownership
   - Add authorization checks on API endpoints

3. **Booking Conflict Prevention**
   - Real-time availability checking on the frontend
   - Visual calendar view to see room availability
   - Prevent overlapping bookings more robustly
   - Show available time slots for rooms

4. **Enhanced Validation**
   - Check room capacity against number of attendees
   - Validate booking durations (minimum/maximum)
   - Business hours enforcement
   - Buffer time between bookings

### Medium Priority Improvements

5. **Calendar View**
   - Full calendar interface for viewing all bookings
   - Drag-and-drop to reschedule bookings
   - Day/week/month view options
   - Filter by room or date range

6. **Search & Filtering**
   - Search rooms by name, capacity, or features
   - Filter bookings by date, room, or status
   - Advanced search with multiple criteria

7. **Notifications System**
   - Email reminders for upcoming bookings
   - Booking confirmation emails
   - Cancellation notifications
   - Room availability alerts

8. **Enhanced Dashboard**
   - Interactive charts and graphs (e.g., Chart.js or D3.js)
   - Room utilization over time
   - Peak usage patterns visualizationV

9. **Error Handling & Logging**
   - Comprehensive error handling on backend
   - User-friendly error messages
   - Server-side logging (Winston or similar)
 
### Nice-to-Have Improvements

10. **Recurring Bookings**
    - Support for daily/weekly/monthly recurring meetings
    - Ability to edit series or single instance
    - Exception handling for recurring series

11. **Room Features Enhancement**
    - Equipment management (projectors, whiteboards, etc.)
    - Photos/images of rooms
    - Floor plans and room locations
    - Amenities checklist

12. **Booking Enhancements**
    - Add attendee list to bookings
    - Meeting agenda/description field
    - Attachment support (agendas, documents)
    - Integration with calendar apps (Google Calendar, Outlook)

13. **UI/UX Polish**
    - Dark mode toggle
    - Customizable themes
    - Accessibility improvements (ARIA labels, keyboard navigation)
    - Loading skeletons instead of spinners

14. **Performance Optimizations**
    - Implement pagination for large datasets
    - Virtual scrolling for long lists
    - Lazy loading of components
    - Bundle size optimization

15. **Testing**
    - Unit tests for components (Vitest)
    - Integration tests for API endpoints (Jest)
    - E2E tests (Playwright or Cypress)
    - Test coverage reporting

16. **DevOps & Deployment**
    - Docker containerization
    - CI/CD pipeline setup
    - Environment configuration management
    - Production build optimization
    - Hosting setup (Netlify/Vercel for frontend, Heroku/Railway for backend)

17. **Documentation**
    - API documentation (Swagger/OpenAPI)
    - Inline code comments


