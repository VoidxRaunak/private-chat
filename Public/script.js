const socket = io();

const joinScreen = document.getElementById("join-screen");
const chatScreen = document.getElementById("chat-screen");

const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");

const messageInput = document.getElementById("message");
const messages = document.getElementById("messages");
const roomName = document.getElementById("room-name");

let username = "";
let room = "";

function joinChat() {
  username = usernameInput.value.trim();
  room = roomInput.value.trim();

  if (!username || !room) {
    alert("Please enter your name and room code!");
    return;
  }

  socket.emit("join-room", {
    username: username,
    room: room
  });

  roomName.textContent = "Room: " + room;

  joinScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");

  messageInput.focus();
}

function sendMessage() {
  const message = messageInput.value.trim();

  if (!message) return;

  socket.emit("send-message", message);

  messageInput.value = "";
  messageInput.focus();
}

socket.on("receive-message", (data) => {
  const div = document.createElement("div");

  div.classList.add("message");

  div.innerHTML = `
    <strong>${escapeHTML(data.username)}</strong><br>
    ${escapeHTML(data.message)}
  `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

socket.on("system-message", (message) => {
  const div = document.createElement("div");

  div.classList.add("system");
  div.textContent = message;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
});

messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}