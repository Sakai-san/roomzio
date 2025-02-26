import axios from "redaxios";
import { Room } from "../../api/server";

export async function getRoom(id: string) {
  return await axios.get<Room>(`http://localhost:3000/rooms/${id}`).then((r) => r.data);
}
