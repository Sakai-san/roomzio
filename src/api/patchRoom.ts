import { NonEmptyString } from "../types";

export const patchRoom = async <N extends string>(roomId: string, payload: { name: NonEmptyString<N> }) =>
  fetch(`http://localhost:3000/rooms/${roomId}`, { method: "PATCH", body: JSON.stringify(payload) });
