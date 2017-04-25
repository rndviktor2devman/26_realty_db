import os


basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'rdb.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False
password_for_update_db = '123456'
default_db_source_path = 'https://devman.org/assets/ads.json'
COUNT_AD_PER_PAGE = 15
NON_NEW_BUILDING_AGE = 2
MAIN_CITIES_LIST = 'Череповец', 'Шексна', 'Вологда'
