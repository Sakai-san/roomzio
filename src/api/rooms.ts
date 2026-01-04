import { NonEmptyString } from "../types";
import { supabase } from "../lib/supabase";
import { Result } from "@swan-io/boxed";

export type RoomType = {
  id: string;
  name: string;
  busy: boolean;
};

const SIZE = 50;

const patchRoom = async ({
  roomId,
  name,
}: {
  roomId: string;
  name: string;
}) => {
  const { data, error } = await supabase
    .from("rooms")
    .update({ name })
    .eq("id", roomId)
    .select()
    .single();

  return error ? Result.Error(error) : Result.Ok(data);
};

async function getRooms(
  page: number
): Promise<{ count: number; rooms: Array<RoomType> }> {
  const from = (page - 1) * SIZE;
  const to = from + SIZE - 1;

  const {
    data: rooms,
    error,
    count,
  } = await supabase
    .from("rooms")
    .select("id, name, booker_id", { count: "exact" })
    .range(from, to);

  if (error) throw error;

  const response = {
    count: Math.ceil((count || 0) / SIZE),
    rooms: (rooms || []).map(({ id, name, booker_id }) => ({
      id,
      name,
      busy: !!booker_id,
    })) as Array<RoomType>,
  };

  return response;
}

async function getRoom(id: string) {
  const { data: room, error } = await supabase
    .from("rooms")
    .select(
      `*,
      devices(id, name, type, battery_level),
      Auth.users(*)`
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!room) throw new Error("Room not found");

  return room;
}

const deleteRoom = async (roomId: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .delete()
    .eq("id", roomId);

  return error ? Result.Error(error) : Result.Ok(data);
};

export { patchRoom, getRooms, getRoom, deleteRoom };
