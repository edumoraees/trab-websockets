import tornado.ioloop
import tornado.web
import tornado.websocket
import json
from datetime import datetime

# Conjunto de clientes conectados
connected_clients = set()


class ChatWebSocketHandler(tornado.websocket.WebSocketHandler):
    #Handler principal do WebSocket para o chat.

    def check_origin(self, origin):
        # Permite conexões de qualquer origem 
        return True

    def open(self):
        #Chamado quando um novo cliente se conecta.
        connected_clients.add(self)
        print(f"[{self._timestamp()}] Novo cliente conectado. Total: {len(connected_clients)}")# log no terminal

        # Notifica todos sobre a entrada de um novo usuário
        self._broadcast({
            "type": "system",
            "message": f"Um novo usuário entrou no chat.",
            "users": len(connected_clients),
            "timestamp": self._timestamp()
        }, exclude=self)

        # Envia mensagem de boas-vindas ao novo cliente
        self.write_message(json.dumps({
            "type": "system",
            "message": "Bem-vindo ao chat! Digite seu nome e comece a conversar.",
            "users": len(connected_clients),
            "timestamp": self._timestamp()
        }))

    def on_message(self, message):
        #Chamado quando uma mensagem é recebida do cliente
        try:
            data = json.loads(message) #transforma texto em objeto python
            msg_type = data.get("type", "message")

            if msg_type == "message":
                username = data.get("username", "Anônimo")
                text = data.get("text", "").strip()

                if not text:
                    return

                print(f"[{self._timestamp()}] {username}: {text}")

                # Transmite a mensagem para todos os clientes conectados
                self._broadcast({
                    "type": "message",
                    "username": username,
                    "text": text,
                    "timestamp": self._timestamp()
                })

        except json.JSONDecodeError:
            print("Mensagem inválida recebida (não é JSON).")

    def on_close(self):
        #Chamado quando um cliente se desconecta.
        connected_clients.discard(self)
        print(f"[{self._timestamp()}] Cliente desconectado. Total: {len(connected_clients)}")

        # Notifica os demais sobre a saída
        self._broadcast({
            "type": "system",
            "message": "Um usuário saiu do chat.",
            "users": len(connected_clients),
            "timestamp": self._timestamp()
        })

    def _broadcast(self, data, exclude=None):
        #Envia uma mensagem para todos os clientes conectados
        payload = json.dumps(data)
        for client in list(connected_clients):
            if client != exclude:
                try:
                    client.write_message(payload)
                except tornado.websocket.WebSocketClosedError:
                    connected_clients.discard(client)

    def _timestamp(self):
        #Retorna o horário atual formatado
        return datetime.now().strftime("%H:%M:%S")


class MainHandler(tornado.web.RequestHandler):
    #Serve o arquivo HTML do cliente

    def get(self):
        self.render("index.html")


def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ws", ChatWebSocketHandler),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "."}),
    ], template_path=".")


if __name__ == "__main__":
    app = make_app()
    port = 8888
    app.listen(port)
    print(f"Servidor iniciado em http://localhost:{port}")
    print("Pressione Ctrl+C para encerrar.")
    tornado.ioloop.IOLoop.current().start()
