import socket
from connect_bluetooth import select_bluetooth_device

# device_address = '98:d3:71:fe:6a:f1'
device_address = select_bluetooth_device()
port = 1

sock = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
sock.connect((device_address, port))

# while True:
data = sock.recv(1024)
print('Received:', data)

sock.close()