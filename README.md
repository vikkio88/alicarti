# alicarti

A Websocket game framework with `bun`.


This is the spiritual successor of 2 of my previous side projects: [strummulu](https://github.com/vikkio88/strummulu) and [ammishka](https://github.com/vikkio88/ammishka), both implemented with nodejs and [socketio](https://socket.io/).

Here I am trying to recreate and finish the project with bun and svelte5.

- [ ] Send special commands to clients on EVERYONE topic (kick/remove/close)
- [ ] Setup room with Game on
    - [ ] Allow clients to specify what type of room they support
    - [ ] Room Type will link what the state to update looks like
- [ ] Cleanup after everyone has left the room