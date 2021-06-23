# A real-time chatting application where multiple clients can be connected at the same time and send messages. Implemented using NodeJs and socket.io

> For every client instance, a socket connection is made with the server. Messages posted by one client is listened by server and then broadcasted for all other connected clients to view. Message history is maintained until client disconnects

## Key features
- Other clients can see who is typing
- New user connecting/existing user disconnecting information broadcasted
- Functionality to change username (change is broadcasted)
- Random avatar for user
- Storing username in localstorage to display on future visits
- Random background on every connection
- Unique username validation
- Different card colors to distinguish own messages from others  
