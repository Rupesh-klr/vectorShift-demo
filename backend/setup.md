1)cd path/to/your/backend
2)python3 -m venv venv
3)source venv/bin/activate

4)pip install fastapi "uvicorn[standard]" python-multipart
runingserver
[{uvicorn main:app --reload given}]
5)uvicorn main:app --reload

setting up 
pip freeze > requirements.txt
install -> pip install -r requirements.txt
build -> uvicorn main:app --host 0.0.0.0 --port $PORT
