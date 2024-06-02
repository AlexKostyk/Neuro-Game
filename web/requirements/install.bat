@echo off
python -m venv ..\env
call ..\env\Scripts\activate
pip install -r ..\requirements\requirements.txt
pause