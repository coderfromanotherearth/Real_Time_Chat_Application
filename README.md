# A real-time chatting application where multiple clients can be connected at the same time and send messages. Implemented using NodeJs and socket.io

- For every client instance, a socket connection is made with the server. Messages posted by one client is listened by server and then broadcasted for all other connected clients to view. Message history is maintained.
