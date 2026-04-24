let ws = null;
let username = "";

function entrarNoChat() {
  const input = document.getElementById("username-input");
  const nome = input.value.trim(); // padroniza nome tirando espaços antes e depois

  if (!nome) {//coloca cursos no campo para digitar nome
    input.focus();
    return;
  }

  username = nome;

  //esconde login e mostra tela do chat
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("chat-screen").style.display = "flex";
  conectarWebSocket();
}

//conecta o navegador ao backend
function conectarWebSocket() {
  const url = `ws://${location.host}/ws`;
  ws = new WebSocket(url);

//eventos
  ws.onopen = () => {
    setStatus("Conectado", "connected");
    document.getElementById("msg-input").disabled = false;
    document.getElementById("send-btn").disabled = false;
    document.getElementById("msg-input").focus();
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data); //converte texto em objeto JS (vem do servidor como JSON)
    renderMensagem(data); 
    if (data.users !== undefined) { //atualiza número de usuários online
      document.getElementById("user-count").textContent = data.users;
    }
  };

  ws.onclose = () => {
    setStatus("Desconectado — tentando reconectar...", "disconnected");
    document.getElementById("msg-input").disabled = true; //desativa input
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
  if (!text || !ws || ws.readyState !== WebSocket.OPEN) return; //valida se tem texto, conexao e se está aberto

  ws.send(JSON.stringify({ type: "message", username, text }));//transforma objeto em texto json e envia pro servidor
  //limpa campo
  input.value = "";
  input.focus();
}

function renderMensagem(data) {
  const container = document.getElementById("messages");
  const div = document.createElement("div");

  if (data.type === "system") {
    //mostra mensagem de entrou e saiu
    div.className = "msg system";
    div.textContent = `🔔 ${data.message} (${data.timestamp || ""})`;
  } else {
    const isMine = data.username === username; // verfica se a mensagem é == do username
    div.className = `msg ${isMine ? "mine" : "other"}`;
    //layout da mensagem
    div.innerHTML = `
      <div class="meta">${isMine ? "Você" : data.username} · ${data.timestamp}</div>
      ${escapeHtml(data.text)}
    `;
  }

  container.appendChild(div);//adiciona na tela
  container.scrollTop = container.scrollHeight;// faz o scroll descer automaticamente
}

function setStatus(msg, type) {
  const el = document.getElementById("status-text");
  el.textContent = msg;
  el.className = `status-${type}`;
}
// substitui < por &lt; e > &gt; para evitar ataques
function escapeHtml(text) {
  return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

document.addEventListener("DOMContentLoaded", () => { //executa quando a pagina carrega
  //enter no login e no chat
  document.getElementById("username-input").addEventListener("keydown", e => {
    if (e.key === "Enter") entrarNoChat();
  });
  document.getElementById("msg-input").addEventListener("keydown", e => {
    if (e.key === "Enter") enviarMensagem();
  });
});