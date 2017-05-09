import os


basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'rdb.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False
PASSWORD_FOR_DB_UPDATE = '123456'
DEFAULT_DB_SOURCE_PATH = 'https://devman.org/assets/ads.json'
COUNT_AD_PER_PAGE = 7
MAX_NEW_BUILDING_AGE = 2
MAIN_CITIES_LIST = 'Череповец', 'Шексна', 'Вологда'
