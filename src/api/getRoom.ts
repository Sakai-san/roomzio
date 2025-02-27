import { Room } from "../../api/server";

export async function getRoom(id: string): Promise<Room> {
  const room = await fetch(`http://localhost:3000/rooms/${id}`);
  const json = await room.json();
  return json;
}
