# Real Estate Site

Simple board for real estate company

Provides functionality:
* loads data from different json sources(plain file or internet source)
* stores data in SQLite database
* filtration + pagination

# Project Goals

The code is written for educational purposes. Training course for web-developers - [DEVMAN.org](https://devman.org)

# Setup

Before run you have to fulfill requirements:
```
pip3 install -r requirements.txt
```

# Startup
```
python3 server.py
```
By [link](http://localhost:5000/) will be available site. 
You have to import data to database. To do it enter password to the 'База данных' section and hit 'enter'.
Default password is '123456' and it's stored in 'config.py' with name 'PASSWORD_FOR_DB_UPDATE'

Then you'll be able to import data into your database(most obvious way - leave defaults and hit 'Обновить базу')