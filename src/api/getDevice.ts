import axios from "redaxios";
import { Device } from "../../api/server";

export async function getRoom(id: string): Promise<Device> {
  const rooms = await fetch(`http://localhost:3000/devices/${id}`);
  const json = await rooms.json();
  return json;
}
