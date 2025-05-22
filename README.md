# alicarti

A Websocket game framework with `bun`.

This is the spiritual successor of 2 of my previous side projects: [strummulu](https://github.com/vikkio88/strummulu) and [ammishka](https://github.com/vikkio88/ammishka), both implemented with nodejs and [socketio](https://socket.io/).

Here I am trying to recreate and finish the project with bun and svelte5.

## Fullstack

- [ ] Send special commands to clients on EVERYONE topic (kick/remove/close)
- [ ] Server announcement ^ on broadcast topic
- [ ] Setup room with Game on
  - [x] Fix tests
  - [x] Room Type will link what the state to update looks like
  - [x] Chat room
  - [x] Adding names to rooms and clients instead of only ids
  - [ ] Allow clients to specify what type of room they support
  - [ ] Allow clients to specify options on room/game creation
- [x] Cleanup on room leaving
  - [x] Cleanup after everyone has left the room
  - [x] ~~Make someone else admin~~ Done on room level
  - [x] ~~Remove state_update after leaving room~~ Done on room level
- [ ] Global toast errors/info
    - [ ] FE
    - [ ] Trigger remotely
- [ ] ~~incremental state update~~ Done on room level
- [x] Decide where to put name on client
- [x] Check if Client is already in room if it is reject it

## FE
- [x] Global State for Connection and Room mgmt.

## RPS
- [x] Autostart on 2 joined
- [x] Prevent more than 2 people to join as players
- [x] Implement game over
- [x] Implement better UI for spectator
- [x] Handle people leaving