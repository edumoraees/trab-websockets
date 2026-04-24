let ws = null;
let username = "";

function entrarNoChat() {
  const input = document.getElementById("username-input");
  const nome = input.value.trim();
  if (!nome) {
    input.focus();
    return;
  }
  username = nome;
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "flex";
  conectarWebSocket();
}

function conectarWebSocket() {
  const url = `ws://${location.host}/ws`;
  ws = new WebSocket(url);

  ws.onopen = () => {
    setStatus("Conectado", "connected");
    document.getElementById("msg-input").disabled = false;
    document.getElementById("send-btn").disabled = false;
    document.getElementById("msg-input").focus();
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    renderMensagem(data);
    if (data.users !== undefined) {
      document.getElementById("user-count").textContent = data.users;
    }
  };

  ws.onclose = () => {
    setStatus("Desconectado — tentando reconectar...", "disconnected");
    document.getElementById("msg-input").disabled = true;
    document.getElementById("send-btn").disabled = true;
    setTimeout(conectarWebSocket, 3000);
  };

  ws.onerror = () => {
    setStatus("Erro na conexão", "disconnected");
  };
}

function enviarMensagem() {
  const input = document.getElementById("msg-input");
  const text = input.value.trim();
  if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;

  ws.send(JSON.stringify({ type: "message", username, text }));
  input.value = "";
  input.focus();
}

function renderMensagem(data) {
  const container = document.getElementById("messages");
  const div = document.createElement("div");

  if (data.type === "system") {
    div.className = "msg system";
    div.textContent = `🔔 ${data.message} (${data.timestamp || ""})`;
  } else {
    const isMine = data.username === username;
    div.className = `msg ${isMine ? "mine" : "other"}`;
    div.innerHTML = `
      <div class="meta">${isMine ? "Você" : data.username} · ${data.timestamp}</div>
      ${escapeHtml(data.text)}
    `;
  }

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function setStatus(msg, type) {
  const el = document.getElementById("status-text");
  el.textContent = msg;
  el.className = `status-${type}`;
}

function escapeHtml(text) {
  return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("username-input").addEventListener("keydown", e => {
    if (e.key === "Enter") entrarNoChat();
  });
  document.getElementById("msg-input").addEventListener("keydown", e => {
    if (e.key === "Enter") enviarMensagem();
  });
});