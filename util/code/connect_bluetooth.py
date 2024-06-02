import bluetooth
import tkinter as tk

def scan_bluetooth_devices():
    try:
        # Discover Bluetooth devices with names and classes.
        discovered_devices = bluetooth.discover_devices(lookup_names=True, lookup_class=True)
        # Display information about the scanning process.
        print('[!] Scanning for active devices...')
        print(f"[!] Found {len(discovered_devices)} Devices\n")
        # Create a list to store information about discovered devices
        devices_info = []
        # Iterate through discovered devices and add their details to the list
        for addr, name, device_class in discovered_devices:
            devices_info.append({'name': name, 'address': addr, 'device_class': device_class})
            print(f'[+] Name: {name}')
            print(f'[+] Address: {addr}')
            print(f'[+] Device Class: {device_class}\n')
        # Return the list of discovered devices
        return devices_info
    except Exception as e:
        # Handle and display any exceptions that occur during device discovery
        print(f"[ERROR] An error occurred: {e}")
        return None


def select_bluetooth_device():
    devices = scan_bluetooth_devices()
    
    # Create a Tkinter window
    window = tk.Tk()
    window.title("Select Bluetooth Device")

    # Function to handle selection
    def select_device():
        selected_device = listbox.get(tk.ACTIVE)
        mac_address = selected_device.split('-')[-1].strip()  # Разделяем строку по дефису, берем последний элемент и удаляем лишние пробелы
        print(f"Selected Device: {selected_device}")
        window.destroy()
        return mac_address

    # Create a listbox to display the Bluetooth devices
    listbox = tk.Listbox(window, width=40, height=10)  # Установим ширину и высоту списка
    for device in devices:
        listbox.insert(tk.END, f"{device['name']} - {device['address']}")

    # Create a button to select the device
    select_button = tk.Button(window, text="Select", width=20, command=lambda: window.quit())  # Заменяем command на lambda, чтобы окно закрывалось без вызова select_device()

    # Pack the widgets with padding
    listbox.pack(pady=10)
    select_button.pack(pady=5)

    # Set window dimensions
    window.geometry(f"300x230")

    # Run the Tkinter event loop
    window.mainloop()

    # Вызываем функцию select_device() и возвращаем ее результат
    return select_device()



