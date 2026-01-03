import { Device } from "../../api/server";
import { supabase } from "../lib/supabase";

async function getDevice(id: string): Promise<Device> {
  const { data: device, error } = await supabase
    .from("devices")
    .select("*", { count: "exact" })
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!device) throw new Error("Device not found");

  return device;
}

export { getDevice };
