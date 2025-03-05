import { NonEmptyString } from "../types";

export const patchRoom = async <N extends string>(payload: {
  roomId: string;
  body: {
    name: NonEmptyString<N>;
  };
}) => fetch(`http://localhost:3000/rooms/${payload.roomId}`, { method: "PATCH", body: JSON.stringify(payload.body) });
