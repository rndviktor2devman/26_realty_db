import json
import requests
import datetime


def dump_data(filename):
    request_url = 'https://devman.org/assets/ads.json'
    response = requests.get(request_url)
    flats_set = response.json()
    with open(filename, 'w') as file_write:
        json.dump(flats_set, file_write, ensure_ascii=False)


if __name__ == '__main__':
    filename = 'flats_{}.json'.format(datetime.datetime.now()
                                      .strftime("%Y-%m-%d %H:%M:%S"))
    dump_data(filename)
