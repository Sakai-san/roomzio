const postBooking = async (roomId: string) => fetch(`http://localhost:3000/rooms/${roomId}/book`, { method: "POST" });

export { postBooking };
