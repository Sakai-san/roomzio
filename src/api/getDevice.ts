import axios from "redaxios";
import { Device } from "../../api/server";

export async function getDevice(id: string) {
  return await axios.get<Device>(`http://localhost:3000/devices/${id}`).then((r) => r.data);
}
