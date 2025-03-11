import { NonEmptyString } from "../types";
import { Room } from "../../api/server";

export type RoomType = {
  id: string;
  name: string;
  busy: string;
};

const patchRoom = async <N extends string>(payload: {
  roomId: string;
  body: {
    name: NonEmptyString<N>;
  };
}) =>
  fetch(`http://localhost:3000/rooms/${payload.roomId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload.body),
  });

async function getRooms(page = 1): Promise<{ count: number; rooms: Array<RoomType> }> {
  const rooms = await fetch(`http://localhost:3000/rooms?page=${page}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const json = await rooms.json();
  return json;
}

async function getRoom(id: string): Promise<Room> {
  const room = await fetch(`http://localhost:3000/rooms/${id}`);
  const json = await room.json();
  return json;
}

const deleteRoom = async (roomId: string) => fetch(`http://localhost:3000/rooms/${roomId}`, { method: "DELETE" });

export { patchRoom, getRooms, getRoom, deleteRoom };
