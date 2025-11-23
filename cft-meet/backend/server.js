const express = require('express');
const cors = require('cors');

const app = express();
const PORT =  3000;

app.use(cors());
app.use(express.json());

//data 
let rooms = [
    { id: 1, name: "The Forge", capacity: 12, features: ["Projector", "Whiteboard", "Video Conferencing"] },
    { id: 2, name: "Crystal Room", capacity: 4, features: ["TV Screen", "Whiteboard"] },
    { id: 3, name: "Focus Pod", capacity: 1, features: ["Soundproofing"] },
    { id: 4, name: "Innovation Hub", capacity: 20, features: ["Projector", "Whiteboard", "Video Conferencing", "WiFi"] },
    { id: 5, name: "Executive Suite", capacity: 8, features: ["TV Screen", "Video Conferencing", "Whiteboard", "Air Conditioning"] },
    { id: 6, name: "Brainstorm Bay", capacity: 6, features: ["Whiteboard", "TV Screen"] },
    { id: 7, name: "Quiet Corner", capacity: 2, features: ["Soundproofing", "WiFi"] },
    { id: 8, name: "Tech Lab", capacity: 15, features: ["Projector", "Video Conferencing", "Whiteboard", "WiFi"] }
];

let bookings = [
    { id: 101, roomId: 1, title: "Team Sync", start: "2025-11-24T09:00", end: "2025-11-24T10:00" },
    { id: 102, roomId: 4, title: "Q4 Strategy Planning", start: "2025-11-23T14:00", end: "2025-11-23T16:30" },
    { id: 103, roomId: 2, title: "Client Presentation", start: "2025-11-25T10:00", end: "2025-11-25T11:30" },
    { id: 104, roomId: 5, title: "Board Meeting", start: "2025-11-26T09:00", end: "2025-11-26T12:00" },
    { id: 105, roomId: 3, title: "Focus Time - Code Review", start: "2025-11-23T13:00", end: "2025-11-23T14:00" },
    { id: 106, roomId: 8, title: "Product Demo", start: "2025-11-24T15:00", end: "2025-11-24T16:00" },
    { id: 107, roomId: 6, title: "Design Sprint Workshop", start: "2025-11-27T10:00", end: "2025-11-27T12:00" },
    { id: 108, roomId: 1, title: "All Hands Meeting", start: "2025-11-28T09:00", end: "2025-11-28T10:30" },
    { id: 109, roomId: 7, title: "1-on-1 with Manager", start: "2025-11-23T11:00", end: "2025-11-23T11:30" },
    { id: 110, roomId: 4, title: "Training Session - New Software", start: "2025-11-29T13:00", end: "2025-11-29T15:00" },
    { id: 111, roomId: 2, title: "Budget Review", start: "2025-11-24T11:00", end: "2025-11-24T12:00" },
    { id: 112, roomId: 5, title: "Investor Pitch", start: "2025-11-25T14:00", end: "2025-11-25T15:30" },
    { id: 113, roomId: 8, title: "Engineering Standup", start: "2025-11-23T09:30", end: "2025-11-23T10:00" },
    { id: 114, roomId: 6, title: "Marketing Campaign Review", start: "2025-11-26T15:00", end: "2025-11-26T16:30" },
    { id: 115, roomId: 3, title: "Deep Work Session", start: "2025-11-27T14:00", end: "2025-11-27T16:00" }
];

//api routes 

app.get('/', (req, res) => {
    res.send('RoomForge API is running...');
});

// LIST + VIEW all rooms (or a specific room if ?id=X is provided)
app.get('/api/rooms', (req, res) => {

    const { id } = req.query;

    if (id) {
        const room = rooms.find(r => r.id === parseInt(id));

        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }

        return res.json(room);
    }

    res.json(rooms);
});

// CREATE a new room
app.post('/api/rooms', (req, res) => {

    const { name, capacity, features } = req.body;

    if (!name || !capacity) {
        return res.status(400).json({ error: "Name and capacity are required." });
    }

    const maxId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) : 0;
    const newId = maxId + 1;

    const newRoom = {
        id: newId,
        name: name,
        capacity: parseInt(capacity), 
        features: features || []      
    };

    rooms.push(newRoom);

    res.status(201).json(newRoom);
});

// UPDATE an existing room
app.put('/api/rooms/:id', (req, res) => {

    const roomId = parseInt(req.params.id);
    
    const room = rooms.find(r => r.id === roomId);

    if (!room) {
        return res.status(404).json({ error: "Room not found" });
    }

    const { name, capacity, features } = req.body;
    room.name = name || room.name;
    room.capacity = capacity ? parseInt(capacity) : room.capacity;
    room.features = features || room.features;

    res.json(room);
});

// DELETE a room
app.delete('/api/rooms/:id', (req, res) => {
    const roomId = parseInt(req.params.id);
    
    const index = rooms.findIndex(r => r.id === roomId);

    if (index === -1) {
        return res.status(404).json({ error: "Room not found" });
    }

    const deletedRoom = rooms.splice(index, 1);

    res.json(deletedRoom[0]);
});



// LIST + VIEW bookings (Supports fetching by ID, by RoomID, or all)
app.get('/api/bookings', (req, res) => {
    const { roomId, id } = req.query;

    // View Single Booking Details (e.g., ?id=101)
    if (id) {
        const booking = bookings.find(b => b.id === parseInt(id));
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        return res.json(booking);
    }
    
    // List Bookings for a specific Room (e.g., ?roomId=1)
    if (roomId) {
        const filtered = bookings.filter(b => b.roomId === parseInt(roomId));
        return res.json(filtered);
    }
    
    // List All Bookings
    res.json(bookings);
});

// CREATE a new booking
app.post('/api/bookings', (req, res) => {
    const { roomId, title, start, end } = req.body;

    if (!roomId || !title || !start || !end) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const roomExists = rooms.find(r => r.id === roomId);
    if (!roomExists) {
        return res.status(404).json({ error: "Room does not exist" });
    }

    const hasOverlap = bookings.some(b => {
        return b.roomId === roomId && // Same room
               new Date(start) < new Date(b.end) && 
               new Date(end) > new Date(b.start);
    });

    if (hasOverlap) {
        return res.status(409).json({ error: "Room is already booked for this time slot" });
    }

    const newBooking = {
        id: Date.now(), 
        roomId,
        title,
        start,
        end
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
});

// UPDATE an existing booking
app.put('/api/bookings/:id', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const { roomId, title, start, end, startTime, endTime } = req.body;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    const newRoomId = roomId || booking.roomId;
    const newStart = start || startTime || booking.start;
    const newEnd = end || endTime || booking.end;

    if (roomId && roomId !== booking.roomId) {
        const roomExists = rooms.find(r => r.id === newRoomId);
        if (!roomExists) {
            return res.status(404).json({ error: "Room does not exist" });
        }
    }

    // add "b.id !== bookingId" to ignore the booking we are editing.
    const hasOverlap = bookings.some(b => {
        if (b.id === bookingId) return false; // Skip self

        return b.roomId === newRoomId &&
               new Date(newStart) < new Date(b.end) &&
               new Date(newEnd) > new Date(b.start);
    });

    if (hasOverlap) {
        return res.status(409).json({ error: "Room is already booked for this updated time slot" });
    }

    booking.roomId = newRoomId;
    booking.title = title || booking.title;
    booking.start = newStart;
    booking.end = newEnd;

    res.json(booking);
});

// DELETE a booking
app.delete('/api/bookings/:id', (req, res) => {
    const bookingId = parseInt(req.params.id);
    const index = bookings.findIndex(b => b.id === bookingId);

    if (index === -1) {
        return res.status(404).json({ error: "Booking not found" });
    }

    const deletedBooking = bookings.splice(index, 1);
    res.json(deletedBooking[0]);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});