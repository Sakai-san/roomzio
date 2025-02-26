import axios from "redaxios";

export type RoomType = {
  id: string;
  name: string;
  busy: string;
};

export async function getRooms() {
  return await axios.get<Array<RoomType>>("http://localhost:3000/rooms").then((r) => r.data);
}
