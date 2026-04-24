# Chat em Tempo Real com WebSocket

Aplicação de chat em tempo real desenvolvida com **Python**, **Tornado Framework** e **WebSockets**, como parte do trabalho prático da disciplina de Computação Distribuida.

## Integrantes do Grupo

- Luis Eduardo - RA 1134332
- João Vitor Voese - RA 1135759

## Descrição

Este projeto implementa um sistema de chat multiusuário em tempo real. O servidor é construído com o framework **Tornado**, que gerencia múltiplas conexões WebSocket simultâneas. O cliente é uma interface web em **HTML/JavaScript puro** que se comunica de forma bidirecional e persistente com o servidor.

### Funcionalidades

- Entrada no chat com nome de usuário
- Envio e recebimento de mensagens em tempo real
- Notificações de entrada e saída de usuários
- Contador de usuários conectados
- Reconexão automática em caso de queda
- Interface responsiva e moderna

## Tecnologias Utilizadas

- Python 3.10+
- Tornado Framework (servidor WebSocket)
- HTML5 + JavaScript (cliente)
- WebSocket Protocol (RFC 6455)

## Requisitos

- Python 3.10 ou superior
- pip

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/edumoraees/trab-websockets
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

O servidor iniciará na porta **8888**.

### 4. Acesse o chat

Abra o navegador e acesse:

```
http://localhost:8888
```

Para testar com múltiplos usuários, abra várias abas ou navegadores.

## Estrutura do Projeto

```
/
├── server.py          # Servidor WebSocket com Tornado
├── index.html         # Interface web do cliente
├── requirements.txt   # Dependências Python
└── README.md          # Este arquivo
```

## Funcionamento do WebSocket

### Ciclo de vida da conexão

1. **Handshake HTTP → WebSocket**: o cliente envia uma requisição HTTP com `Upgrade: websocket`, e o servidor responde com `101 Switching Protocols`.
2. **`on_open`**: chamado quando a conexão é estabelecida. O cliente é adicionado ao conjunto de conexões ativas.
3. **`on_message`**: chamado a cada mensagem recebida. O servidor faz broadcast para todos os clientes conectados.
4. **`on_close`**: chamado quando a conexão é encerrada. O cliente é removido do conjunto e os demais são notificados.

### Gerenciamento de múltiplos clientes

O servidor mantém um `set` Python com todas as instâncias de `WebSocketHandler` ativas. Ao receber uma mensagem, itera sobre esse conjunto e envia para todos (broadcast). Conexões encerradas são removidas automaticamente.

## Formato das Mensagens (JSON)

**Mensagem de chat (cliente → servidor):**
```json
{ "type": "message", "username": "João", "text": "Olá!" }
```

**Broadcast para clientes (servidor → todos):**
```json
{ "type": "message", "username": "João", "text": "Olá!", "timestamp": "14:32:10" }
```

**Mensagem de sistema:**
```json
{ "type": "system", "message": "Um novo usuário entrou no chat.", "users": 3, "timestamp": "14:32:10" }
```
