const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);

socket.addEventListener("message", (event) => {
  console.log(event.data);
});

socket.addEventListener("open", () => {
  socket.send("ciao");
});
