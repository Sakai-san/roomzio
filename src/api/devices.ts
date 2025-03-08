import { Device } from "../../api/server";

async function getDevice(id: string): Promise<Device> {
  const device = await fetch(`http://localhost:3000/devices/${id}`);
  const json = await device.json();
  return json;
}

export { getDevice };
