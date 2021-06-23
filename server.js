const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { AvatarGenerator } = require("random-avatar-generator");
const generator = new AvatarGenerator();
const app = express();

const connectedUsers = [];

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/checkIfUniqueUserName", (req, res) => {
  res.send(!connectedUsers.includes(req.query.username));
});

const server = app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  const { existingUserName } = socket.handshake.query;
  socket.username = existingUserName || uuidv4();
  socket.avatar = generator.generateRandomAvatar();
  connectedUsers.push(socket.username);
  socket.emit("set_localstorage_display_username", {
    newUserName: socket.username,
  });
  socket.emit("display_avatar", { avatar: socket.avatar });
  socket.broadcast.emit("new_user_joined_broadcast", {
    newUserName: socket.username,
  });

  socket.on("set_new_username", ({ newUserName }) => {
    const oldUserName = socket.username,
      index = connectedUsers.indexOf(oldUserName);
    if (index >= 0) {
      connectedUsers[index] = newUserName;
    }
    socket.username = newUserName;
    socket.emit("set_localstorage_display_username", {
      newUserName,
    });
    socket.broadcast.emit("username_changed_msg", { oldUserName, newUserName });
  });
  socket.on("send_message", ({ message }) => {
    const dateObject = new Date();
    io.sockets.emit("clear_typing_message");
    io.sockets.emit("display_message", {
      sender: socket.username,
      message,
      avatar: socket.avatar,
      time: `${dateObject.getHours()}: ${dateObject.getMinutes()}: ${dateObject.getSeconds()}`,
    });
  });
  socket.on("is_typing", ({ message }) => {
    if (message) {
      socket.broadcast.emit("show_typing_message", {
        typingUsername: socket.username,
      });
    } else {
      io.sockets.emit("clear_typing_message");
    }
  });
  socket.on("disconnect", () => {
    const exitedUserName = socket.username;
    const index = connectedUsers.indexOf(exitedUserName);
    if (index >= 0) {
      connectedUsers.splice(index, 1);
    }
    socket.broadcast.emit("user_left_broadcast", {
      exitedUserName,
    });
  });
});
