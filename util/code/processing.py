import time

def get_attention(sock, curr_speed, curr_attention, curr_fit):
    neuroscanner = Neuroscanner()
    attention = neuroscanner.scan(sock)
        
    if (attention == None):
        return (curr_speed, curr_attention, curr_fit)
    
    if (attention == 0):
        return (0, 0, 0)
    
    if (attention < 35):
        attention = 35
    elif (attention > 55):
        attention = 55
    
    speed = round((attention - 35)/5 + 1, 1)
    print("Speed:", speed)
    print("Attention:", (int(attention) - 35) * 5)
    print("===========================================")
    
    return (speed, (int(attention) - 35) * 5, 1)

class Neuroscanner:
    def __init__(self):
        self.attention = 0
        self.fit = 0
        # self.lastReceivedPacket = 0  # Uncomment this line if needed
        self.poorQuality = 0
        self.bigPacket = False
        self.payloadData = [0] * 170  # Max payload length
        self.payloadLength = 0
        self.total_attention = 0
        self.attention_count = 0
        self.total_fit = 0
        self.fit_count = 0
        self.start_time = time.time()

    def update_average_values(self, attention, fit):
        if attention != 0:
            self.total_attention += attention
            self.attention_count += 1
            
        self.total_fit += fit
        self.fit_count += 1

    def calculate_average_values(self):
        # print(f"Коэффициент прилягания: {self.total_fit}")
        if self.total_fit > 10:
          
            # Сбрасываем счетчики
            self.total_attention = 0
            self.attention_count = 0
            self.fit_count = 0
            self.start_time = time.time()
            
            print("Нет прилягания!")
            return 0
        
        elif self.attention_count > 0:
            avg_attention = self.total_attention / self.attention_count
            
            # Сбрасываем счетчики
            self.total_attention = 0
            self.attention_count = 0
            self.fit_count = 0
            self.start_time = time.time()
            
            print("Полное прилягание")
            return avg_attention

    def read_one_byte(self, sock):
        while True:
            data = sock.recv(1)
            if data:
                return data[0]

    def scan(self, sock):
        while True:
            if self.read_one_byte(sock) == 0xAA:
                if self.read_one_byte(sock) == 0xAA:
                    self.payloadLength = self.read_one_byte(sock)
                    if self.payloadLength > 169:
                        return

                    generatedChecksum = 0
                    for i in range(self.payloadLength):
                        self.payloadData[i] = self.read_one_byte(sock)
                        generatedChecksum += self.payloadData[i]

                    checksum = self.read_one_byte(sock)
                    generatedChecksum = 0xFF - generatedChecksum

                    if checksum == generatedChecksum:
                        self.poorQuality = 200

                        for i in range(self.payloadLength):
                                
                            if self.payloadData[i] == 2:
                                i += 1
                                self.poorQuality = self.payloadData[i]
                                self.bigPacket = True
                            elif self.payloadData[i] == 4:
                                i += 1
                                # self.attention = self.payloadData[i]
                                
                                # # print(self.attention)
                                
                                # self.update_average_values(self.attention, 0)

                            elif self.payloadData[i] == 5:
                                i += 1
                                self.fit = self.payloadData[i]
                                self.update_average_values(0, self.fit)
                                
                            elif self.payloadData[i] == 0x80:
                                i += 3
                                self.attention = self.payloadData[i]                 
                                self.update_average_values(self.attention, 0)
                            elif self.payloadData[i] == 0x83:
                                i += 25
                            else:
                                pass

                        if time.time() - self.start_time >= 1:
                            return self.calculate_average_values()

                        self.bigPacket = False
                    else:
                        pass  # Handle checksum mismatch