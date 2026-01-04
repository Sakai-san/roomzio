import { supabase } from "../lib/supabase";
import { Result } from "@swan-io/boxed";

const postBooking = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string | null;
}) => {
  const { data, error } = await supabase
    .from("rooms")
    .update({ booker_id: userId })
    .eq("id", roomId)
    .select()
    .single();

  return error ? Result.Error(error) : Result.Ok(data);
};

export { postBooking };
