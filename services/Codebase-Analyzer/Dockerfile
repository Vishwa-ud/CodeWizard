FROM python:3.9-alpine
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 3001
CMD ["python", ".\src\app.py"]