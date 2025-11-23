const express = require('express');
const cors = require('cors');

const app = express();
const PORT =  3000;

app.use(cors());
app.use(express.json());

//data 
let rooms = [
    { id: 1, name: "The Forge", capacity: 12, features: ["Projector", "Whiteboard"] },
    { id: 2, name: "Crystal Room", capacity: 4, features: ["TV Screen"] },
    { id: 3, name: "Focus Pod", capacity: 1, features: ["Soundproofing"] }
];

let bookings = [
    { id: 101, roomId: 1, title: "Team Sync", start: "2025-11-24T09:00", end: "2025-11-24T10:00" }
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
    const { roomId, title, start, end } = req.body;

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    const newRoomId = roomId || booking.roomId;
    const newStart = start || booking.start;
    const newEnd = end || booking.end;

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