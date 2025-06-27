const socket = io();
let username = localStorage.getItem('username');
if (!username) {
  username = prompt("Enter your name:");
  localStorage.setItem('username', username);
}
document.getElementById('username-display').innerText = username;

const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const chatBox = document.getElementById('chat-box');

sendBtn.addEventListener('click', sendMessage);
input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const msg = input.value.trim();
  if (msg === "") return;

  socket.emit('send_message', {
    username: username,
    message: msg
  });

  input.value = "";
}

socket.on('receive_message', (data) => {
  const div = document.createElement('div');
  div.classList.add('message');
  if (data.username === username) {
    div.classList.add('sent');
  } else {
    div.classList.add('received');
  }
  div.innerHTML = `
    <span class="username">${data.username}</span>
    ${data.message}
  `;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});
