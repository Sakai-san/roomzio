export const postRelease = async (roomId: string) =>
  fetch(`http://localhost:3000/rooms/${roomId}/release`, { method: "POST" });
