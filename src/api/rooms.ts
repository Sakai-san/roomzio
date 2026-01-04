import { supabase } from "../lib/supabase";
import { Result } from "@swan-io/boxed";

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

async function getRooms(page: number) {
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

  return error
    ? Result.Error(error)
    : Result.Ok({
        count: Math.ceil((count || 0) / SIZE),
        rooms: rooms as Array<{
          id: string;
          name: string;
          booker_id: string | null;
        }>,
      });
}

async function getRoom(id: string) {
  const { data: room, error } = await supabase
    .from("rooms")
    .select(
      `*,
      devices(id, name, type, battery_level),
      users!fk_booker(id, email, first_name, last_name)`
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
