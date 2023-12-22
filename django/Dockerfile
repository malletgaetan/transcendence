FROM python:3.8
RUN mkdir -p /home/app
COPY ./django /home/app/webapp
WORKDIR /home/app/webapp
RUN apt-get update
RUN apt-get install -y --no-install-recommends postgresql-client
RUN rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip  
RUN pip install --no-cache-dir -r requirements.txt  
EXPOSE 8000
CMD python3 manage.py makemigrations && python3 manage.py migrate && daphne -b 0.0.0.0 -p 8000 backend.asgi:application
