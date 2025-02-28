export const postBook = async (roomId: string) =>
  fetch(`http://localhost:3000/rooms/${roomId}/book`, { method: "POST" });
