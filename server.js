const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

var server = app.listen(3000, () => {
  console.log("Server is listening at port 3000");
});

var io = require("socket.io")(server);

io.on("connection", socket => {
  socket.username = "Anonymous";

  socket.on("set_username", data => {
    socket.username = data.username;
  });
  socket.on("send_message", data => {
    io.sockets.emit("display_message", {
      username: socket.username,
      message: data.message
    });
  });
  socket.on("is_typing", () => {
    socket.broadcast.emit("show_typing", { username: socket.username });
  });
});
