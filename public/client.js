$(() => {
  let existingUserName = "";
  if (storageAvailable("localStorage")) {
    existingUserName = localStorage.getItem(USERNAME_LOCALSTORAGE_KEY) || "";
  }
  const socket = io.connect(document.location.href, {
      query: `existingUserName=${existingUserName}`,
    }),
    userAvatarDisplay = $("#user-avatar-display"),
    usernameGreet = $("#username-greet"),
    usernameInputBox = $("#username"),
    setUsernameBtn = $("#set-username"),
    messageInputBox = $("#message"),
    sendMessageBtn = $("#send-message"),
    typingTextContainer = $("#typing-container"),
    bgColorChoices = ["antiquewhite", "lavender", "thistle", "powderblue"];
  let username;

  document.body.style.backgroundColor =
    bgColorChoices[Math.floor(Math.random() * bgColorChoices.length)];

  function attachEventListeners() {
    setUsernameBtn.click(() => {
      const userInput = usernameInputBox.val();
      if (userInput) {
        fetch(`checkIfUniqueUserName?username=${userInput}`)
          .then((res) => res.json())
          .then((res) => {
            if (res) {
              socket.emit("set_new_username", { newUserName: userInput });
              $("#user-exist-error").hide();
            } else {
              $("#user-exist-error").show();
            }
          });
      }
    });
    sendMessageBtn.click(() => {
      const messageInput = messageInputBox.val();
      if (messageInput) {
        socket.emit("send_message", { message: messageInput });
        messageInputBox.val("");
      }
    });
    messageInputBox.on("keyup", () => {
      socket.emit("is_typing", {
        message: messageInputBox.val(),
      });
    });
  }

  function attachSocketListeners() {
    socket.on("display_avatar", ({ avatar }) => {
      userAvatarDisplay.html(
        `<img class="user-avatar-display-style center" src="${avatar}" alt="Avatar" />`
      );
    });
    socket.on("set_localstorage_display_username", ({ newUserName }) => {
      if (storageAvailable("localStorage")) {
        localStorage.setItem(USERNAME_LOCALSTORAGE_KEY, newUserName);
      }
      username = newUserName;
      usernameInputBox.val("");
      usernameGreet.html(`<b>${username}</b>`);
    });
    socket.on("new_user_joined_broadcast", ({ newUserName }) => {
      appendMsgToChatRoom(`<p><b>${newUserName}</b> has joined chat room</p>`);
    });
    socket.on("username_changed_msg", ({ oldUserName, newUserName }) => {
      appendMsgToChatRoom(
        `<p><b>${oldUserName}</b> changed their name to <b>${newUserName}</b></p>`
      );
    });
    socket.on("display_message", ({ sender, message, time, avatar }) => {
      appendMsgToChatRoom(
        getMessageContainer({ sender, message, time, avatar, username })
      );
    });
    socket.on("show_typing_message", ({ typingUsername }) => {
      typingTextContainer.html(`<b>${typingUsername}</b> is typing....`);
    });
    socket.on("clear_typing_message", () => {
      typingTextContainer.html("");
    });
    socket.on("user_left_broadcast", ({ exitedUserName }) => {
      appendMsgToChatRoom(`<p><b>${exitedUserName}</b> has left the room</p>`);
    });
  }

  attachEventListeners();
  attachSocketListeners();
});
