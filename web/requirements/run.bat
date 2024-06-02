@echo off
call ..\env\Scripts\activate
python ..\Neuro_game\manage.py runserver
pause