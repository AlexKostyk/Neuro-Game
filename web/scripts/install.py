import subprocess

def run_batch_file():
    batch_file_path = r"..\requirements\install.bat"
    subprocess.call([batch_file_path], shell=True)

if __name__ == "__main__":
    run_batch_file()