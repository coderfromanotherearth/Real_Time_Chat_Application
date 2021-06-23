let chatroom;
$(() => {
  chatroom = $("#chatroom");
});

function getMessageContainer({ avatar, message, time, sender, username }) {
  return `<div class="container 
            ${sender === username ? `darker` : ``}">
            <div>
                <img src="${avatar}" alt="${sender}"
                    ${sender === username ? `class="right"` : ``}>
                <p>${message}</p>
            </div>
            <div class="time-uname-style">
                <span ${sender === username ? `class="right"` : ``}>
                    <b>${sender}</b>
                </span>
                <span class="${
                  sender === username ? `time-left` : `time-right`
                }">
                    ${time}
                </span>
            </div>
        </div>`;
}

function storageAvailable(storageType) {
  try {
    var storage = window[storageType],
      x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

function appendMsgToChatRoom(message) {
  chatroom.append(message);
}
