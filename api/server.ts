import express, { Request, Response } from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";

const app = express();
app.use(cors());
app.use(express.json());

export interface Device {
  id: string;
  name: string;
  type: string;
  battery: number;
}

interface Booking {
  fullName: string;
  avatar: string;
}

export interface Room {
  id: string;
  name: string;
  booking?: Booking;
  devices: Device[];
}

// Generate mock rooms
let rooms: Room[] = Array.from({ length: 100 }, (_, i) => {
  const devices: Device[] = Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, (_, d) => ({
    id: faker.string.uuid(),
    type: "Display",
    name: `Display ${d + 1}`,
    battery: faker.number.int({ min: 0, max: 100 }),
  }));

  const booking: Booking = {
    fullName: faker.person.fullName(),
    avatar: faker.image.avatar(),
  };

  return {
    id: faker.string.uuid(),
    name: `Room ${i + 1}`,
    devices,
    booking,
  };
});

// List all rooms
app.get("/rooms", (req: Request, res: Response) => {
  res.json(rooms.map(({ id, name, booking }) => ({ id, name, busy: !!booking })));
});

// Get room details
app.get("/rooms/:roomId", (req: Request, res: Response) => {
  const room = rooms.find((r) => r.id === req.params.roomId);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  res.json({
    ...room,
    devices: room.devices.map(({ id, name, type }) => ({ id, name, type })),
  });
});

// Delete room
app.delete("/rooms/:roomId", (req: Request, res: Response) => {
  const room = rooms.find((r) => r.id === req.params.roomId);
  rooms = rooms.filter((r) => r.id !== req.params.roomId);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  res.json({ message: `Room ${room.name} deleted successfully` });
});

// Patch room
app.patch("/rooms/:roomId", (req: Request, res: Response) => {
  const roomIndex = rooms.findIndex((r) => r.id === req.params.roomId);
  const currentName = rooms[roomIndex].name;

  rooms = rooms.map((r, index) => (index === roomIndex ? { ...r, ...req.body } : r));

  if (roomIndex === -1) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  res.json({ message: `${currentName} updated successfully to ${rooms[roomIndex].name}` });
});

// Get device details
app.get("/devices/:deviceId", (req: Request, res: Response) => {
  const device = rooms.flatMap((r) => r.devices).find((d) => d.id === req.params.deviceId);
  if (!device) {
    res.status(404).json({ error: "Device not found" });
    return;
  }
  res.json(device);
});

// Book a room
app.post("/rooms/:roomId/book", (req: Request, res: Response) => {
  const room = rooms.find((r) => r.id === req.params.roomId);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (room.booking) {
    res.status(400).json({ error: "Room is already booked" });
    return;
  }

  room.booking = {
    fullName: faker.person.fullName(),
    avatar: faker.image.avatar(),
  };
  res.json({ message: `Room ${room.name} booked successfully` });
});

// Release a room
app.post("/rooms/:roomId/release", (req: Request, res: Response) => {
  const room = rooms.find((r) => r.id === req.params.roomId);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  if (!room.booking) {
    res.status(400).json({ error: "Room is already free" });
    return;
  }

  room.booking = undefined;
  res.json({ message: `Room ${room.name} is now available` });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`Mock API running on http://localhost:${PORT}`));
