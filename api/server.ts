import express, { Request, Response } from "express";
import cors from "cors";
import { faker } from "@faker-js/faker";
import { random } from "lodash";
import { roomsData } from "./data";

const app = express();
app.use(cors());
app.use(express.json());

const sleep = (ms: number) => new Promise((resolve, reject) => setTimeout(() => resolve(), ms));
const SIZE = 20;

function paginate(collection: Array<any>, pageSize: number, pageNumber: number) {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return collection.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
}

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
/*
let rooms: Room[] = Array.from({ length: 350 }, (_, i) => {
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
*/

let rooms = roomsData;

// List all rooms
app.get("/rooms", (req: Request, res: Response) => {
  const page = req.params.page;
  const sanitizedPage = parseInt(page, 10) || 1;
  const paginatedRooms = paginate(rooms, SIZE, sanitizedPage);

  res.json({
    count: Math.floor(rooms.length / SIZE),
    rooms: paginatedRooms.map(({ id, name, booking }) => ({ id, name, busy: !!booking })),
  });
});

// Get room details
app.get("/rooms/:roomId", async (req: Request, res: Response) => {
  const room = rooms.find((r) => r.id === req.params.roomId);
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  await sleep(random(8000, 10000));

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
app.get("/devices/:deviceId", async (req: Request, res: Response) => {
  const device = rooms.flatMap((r) => r.devices).find((d) => d.id === req.params.deviceId);
  if (!device) {
    res.status(404).json({ error: "Device not found" });
    return;
  }

  await sleep(random(5000, 10000));
  res.json(device);
});

// Book a room
app.post("/rooms/:roomId/book", async (req: Request, res: Response) => {
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

  await sleep(random(1000, 10000));
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
