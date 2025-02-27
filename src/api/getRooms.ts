import axios from "redaxios";

export type RoomType = {
  id: string;
  name: string;
  busy: string;
};

export async function getRooms(): Promise<Array<RoomType>> {
  const rooms = await fetch("http://localhost:3000/rooms");
  const json = await rooms.json();
  return json;
}
