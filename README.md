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
  - [ ] Chat room
  - [ ] Adding names to rooms and clients instead of only ids
  - [ ] Allow clients to specify what type of room they support
- [ ] Cleanup on room leaving
  - [x] Cleanup after everyone has left the room
  - [ ] Make someone else admin
- [ ] Global toast errors/info
    - [ ] FE
    - [ ] Trigger remotely
- [ ] incremental state update
- [x] Decide where to put name on client

## FE

- [ ] Global State for Connection and Room mgmt.
