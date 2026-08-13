# Real-Time Chat with WebSockets

Aplicação de **chat multiusuário em tempo real** desenvolvida com **Python, Tornado Framework e WebSockets**.

O projeto implementa comunicação bidirecional persistente entre navegador e servidor, permitindo múltiplos usuários conectados simultaneamente, envio instantâneo de mensagens, notificações de entrada e saída e reconexão automática.

---

## Funcionalidades

* Entrada no chat com nome de usuário
* Envio e recebimento de mensagens em tempo real
* Comunicação bidirecional utilizando WebSockets
* Suporte a múltiplos clientes conectados simultaneamente
* Broadcast de mensagens para usuários ativos
* Notificações de entrada e saída
* Contador de usuários conectados
* Reconexão automática em caso de perda de conexão
* Troca de mensagens utilizando JSON
* Interface web responsiva

---

## Tecnologias utilizadas

### Backend

* Python 3.10+
* Tornado Framework
* WebSocket Protocol

### Frontend

* HTML5
* CSS3
* JavaScript

### Comunicação

* WebSockets
* JSON

---

## Arquitetura

```text
Browser A ─┐
Browser B ─┼──── WebSocket ────> Tornado Server
Browser C ─┘                          │
                                     │
                                     ▼
                                  Broadcast
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
                Browser A        Browser B        Browser C
```

O servidor mantém as conexões WebSocket ativas e realiza o broadcast das mensagens recebidas para todos os clientes conectados.

---

## Como funciona

### 1. Conexão

O cliente inicia uma conexão com o servidor utilizando o protocolo WebSocket.

Durante o handshake, a conexão HTTP é atualizada para WebSocket:

```text
HTTP Request
     │
     │ Upgrade: websocket
     ▼
Tornado Server
     │
     │ 101 Switching Protocols
     ▼
WebSocket Connection
```

Após a conexão ser estabelecida, cliente e servidor podem trocar mensagens continuamente sem a necessidade de criar uma nova requisição HTTP para cada envio.

---

### 2. Gerenciamento das conexões

O servidor mantém um conjunto com as instâncias de clientes WebSocket conectados.

Quando um novo cliente entra no chat:

```text
Cliente conecta
      │
      ▼
on_open()
      │
      ▼
Adicionado ao conjunto
de conexões ativas
```

Quando o usuário fecha a conexão:

```text
Cliente desconecta
      │
      ▼
on_close()
      │
      ▼
Removido das conexões
ativas
```

Os demais usuários também recebem uma notificação informando a entrada ou saída de participantes.

---

### 3. Envio de mensagens

Quando uma mensagem é enviada:

```text
Cliente
  │
  │ JSON
  ▼
Servidor
  │
  │ on_message()
  ▼
Broadcast
  │
  ├── Cliente A
  ├── Cliente B
  └── Cliente C
```

O servidor recebe a mensagem e a encaminha para todos os clientes atualmente conectados.

---

## Formato das mensagens

As mensagens são transmitidas utilizando **JSON**.

### Mensagem enviada pelo cliente

```json
{
  "type": "message",
  "username": "João",
  "text": "Olá!"
}
```

### Mensagem enviada pelo servidor

```json
{
  "type": "message",
  "username": "João",
  "text": "Olá!",
  "timestamp": "14:32:10"
}
```

### Mensagem de sistema

```json
{
  "type": "system",
  "message": "Um novo usuário entrou no chat.",
  "users": 3,
  "timestamp": "14:32:10"
}
```

---

## Estrutura do projeto

```text
trab-websockets/
├── server.py
├── index.html
├── script.js
├── style.css
├── requirements.txt
└── README.md
```

### Principais arquivos

* `server.py` — servidor HTTP/WebSocket desenvolvido com Tornado
* `index.html` — estrutura da interface do chat
* `script.js` — conexão WebSocket e lógica do cliente
* `style.css` — estilização da interface
* `requirements.txt` — dependências Python do projeto

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/edumoraees/trab-websockets.git
```

Entre na pasta:

```bash
cd trab-websockets
```

### 2. Instale as dependências

```bash
pip install -r requirements.txt
```

### 3. Inicie o servidor

```bash
python server.py
```

O servidor será iniciado na porta:

```text
8888
```

---

## Executando o chat

Com o servidor iniciado, acesse no navegador:

```text
http://localhost:8888
```

Para simular múltiplos usuários, abra o endereço em diferentes abas ou navegadores.

---

## Ciclo de vida do WebSocket

O servidor utiliza os principais eventos do `WebSocketHandler`:

### `open`

Executado quando uma nova conexão é estabelecida.

O cliente passa a fazer parte do conjunto de conexões ativas.

### `on_message`

Executado sempre que uma mensagem é recebida.

O servidor processa a mensagem e realiza o broadcast para os clientes conectados.

### `on_close`

Executado quando uma conexão é encerrada.

O cliente é removido do conjunto de conexões e os demais participantes são notificados.

---

## Conceitos aplicados

O projeto explora conceitos relacionados a:

* Sistemas distribuídos
* Comunicação cliente-servidor
* Comunicação bidirecional
* Conexões persistentes
* WebSockets
* Programação orientada a eventos
* Broadcast de mensagens
* Concorrência de conexões
* Serialização de dados com JSON
* Aplicações em tempo real

---

## Contexto acadêmico

Projeto desenvolvido como trabalho prático da disciplina de **Computação Distribuída**.

### Integrantes

* Luis Eduardo — RA 1134332
* João Vitor Voese — RA 1135759

---


