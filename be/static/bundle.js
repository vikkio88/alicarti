const socket = new WebSocket("ws://localhost:3000");

socket.addEventListener("message", (event) => {
  console.log(event.data);
});

socket.addEventListener("open", () => {
  socket.send("ciao");
});
