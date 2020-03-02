$(() => {
  var socket = io.connect("http://localhost:3000");
  var username = "Anonymous";
  var greeting = $("#greeting");
  var setUsername = $("#set_username");
  var message = $("#message");
  var sendMessage = $("#send_message");
  var chatroom = $("#chatroom");
  greeting.text(`Hi there, ${username}`);

  setUsername.click(() => {
    username = $("#username").val();
    $("#username").val("");
    socket.emit("set_username", { username });
    greeting.text(`Hi there, ${username}`);
  });
  sendMessage.click(() => {
    socket.emit("send_message", { message: message.val() });
    message.val("");
  });

  socket.on("display_message", data => {
    chatroom.append(`<p><b>${data.username}</b> : <i>${data.message}</i></p>`);
  });

  message.bind("keypress", () => {
    socket.emit("is_typing");
  });
  socket.on("show_typing", data => {
    feedback.html(`${data.username} is typing....`);
  });
});
