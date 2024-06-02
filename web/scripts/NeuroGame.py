import subprocess

def run_server():
    batch_file_path = r"..\requirements\run.bat"
    subprocess.call([batch_file_path], shell=True)

if __name__ == "__main__":
    run_server()