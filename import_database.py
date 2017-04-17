import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ad_model import Ad


URL = 'https://devman.org/assets/ads.json'





if __name__ == '__main__':
    json_data = requests.get(URL).json()
    ad_ids = [ad_data['id'] for ad_data in json_data]

    
