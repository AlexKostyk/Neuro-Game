import asyncio
import websockets
import json
import threading
import socket
import keyboard

from processing import get_attention
from connect_bluetooth import select_bluetooth_device

class Shared_variable():
    def __init__(self):
        self.speed = 0
        self.attention = 0
        self.fit = 0

shared_variable = Shared_variable()

async def run_socket(websocket, path):
    async for message in websocket:
        print("Received message:", message)
        
        data = {"speed": shared_variable.speed, "attention": shared_variable.attention, "fit": shared_variable.fit}

        # Преобразование JSON объекта в строку
        json_data = json.dumps(data)

        # Отправка строки JSON через WebSocket
        await websocket.send(json_data)

start_server = websockets.serve(run_socket, "localhost", 12345)

def processing():
    global shared_variable
    device_address = select_bluetooth_device()
    port = 1

    sock = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
    sock.connect((device_address, port))

    while True:
        (shared_variable.speed, shared_variable.attention, shared_variable.fit) = get_attention(sock, shared_variable.speed, shared_variable.attention, shared_variable.fit)
        
        if keyboard.is_pressed('ctrl'):
            print('Processing stopped')
            break

    sock.close()
    
thread = threading.Thread(target=processing)

thread.start()

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

thread.join()