export const deleteRoom = async (roomId: string) =>
  fetch(`http://localhost:3000/rooms/${roomId}`, { method: "DELETE" });
