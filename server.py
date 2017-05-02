from flask import Flask, render_template, request, jsonify, session
from sqlalchemy.sql.expression import func
from datetime import datetime
from sqlalchemy import or_, and_
from collections import defaultdict
import json
import config
import re
import requests
import os

app = Flask(__name__)
app.config.from_object('config')
from ad_model import db, Ad
db.create_all()


def bad_request(error_text=None, error_type=None):
    if error_text is None:
        error_text = 'Bad request:' + request.url
    message = {
        'status': 400,
        'message': error_text,
        'error_type': error_type
    }
    return app.response_class(
        response=json.dumps(message),
        status=400,
        mimetype='application/json'
    )


def parse_json_source(source_path):
    json_data = None
    source_error = None
    if re.match(r'^http[s]?://', source_path):
        http_answer = requests.get(source_path)
        if http_answer.status_code == requests.codes.ok:
            json_data = http_answer.json()
        else:
            source_error = 'no access to server'
    elif os.path.isfile(source_path):
        with open(source_path) as json_file:
            json_data = json.load(json_file)
        if json_data is None:
            source_error = 'cannot parse json file'
    else:
        source_error = 'unrecognised source'

    return json_data, source_error


def import_json_to_db(new_ads):
    any_item_imported = False
    datetime_import = datetime.now().replace(microsecond=0)
    for ad in new_ads:
        ad_item = Ad.query.filter_by(id=ad.get('id')).first()
        if ad_item is None:
            ad_item = Ad()
        any_value_imported = False
        for key, value in ad.items():
            if hasattr(ad_item, key):
                if isinstance(value, str):
                    value = ' '.join(value.split())
                setattr(ad_item, key, value)
                any_value_imported = True
        if any_value_imported:
            setattr(ad_item, 'update_date', datetime_import)
            db.session.add(ad_item)
            any_item_imported = True
    if any_item_imported:
        session['update_date'] = datetime_import
        db.session.commit()
    return any_item_imported, datetime_import


@app.route('/check_db_pass', methods=['POST'])
def check_database_password():
    password = request.json.get('password')
    if password == config.password_for_update_db:
        return jsonify()
    else:
        return bad_request()


@app.route('/get_database_status', methods=['GET'])
def get_database_status():
    stored_date = db.session.query(Ad.update_date, func.max(Ad.update_date)).one()
    last_update_time = 'not updated'
    if stored_date.update_date is not None:
        last_update_time = stored_date.update_date
        session['update_date'] = last_update_time
    data = {
        'path': config.default_db_source_path,
        'update_datetime': last_update_time
    }
    return jsonify(data)


@app.route('/update_database', methods=['POST'])
def update_database():
    if request.json.get('password') == config.password_for_update_db:
        json_ad, error = parse_json_source(request.json.get('path'))
        if json_ad is not None:
            success_import, date_import = import_json_to_db(json_ad)
            if success_import:
                data = {
                    'update_message': 'update_succeed',
                    'update_datetime': date_import
                }
                return jsonify(data)
            else:
                return bad_request('no data imported')
    else:
        return bad_request('password mismatch', error_type=1)


def find_first_upper_char(str_name):
    char = None
    for word in list(str_name):
        if word.isupper() and char is None:
            char = word
    return char


@app.route('/get_district_list', methods=['GET'])
def district_list():
    records = db.session.query(Ad).group_by(Ad.settlement).all()
    if records is not None:
        dict_letters = defaultdict(list)
        main_cities = list()

        for rec in records:
            dict_letters[find_first_upper_char(rec.settlement)].append({'name': rec.settlement, 'district': rec.oblast_district})
            for main_city in config.MAIN_CITIES_LIST:
                if main_city in rec.settlement:
                    main_cities.append({'name': main_city, 'district': rec.oblast_district})

        letters = list()
        for k in sorted(dict_letters):
            letters.append({'letter': k, 'array': dict_letters[k]})

        district_data = {
            'main_cities_map': main_cities,
            'letters': letters
        }

        return jsonify(district_data)
    else:
        return jsonify()


@app.route('/get_ads', methods=['POST'])
def ads_data():
    page = request.json.get('page', 1)
    filter = request.json.get('filter')
    oblast_district = "Череповецкий район"
    min_price = 0
    max_price = 0
    new_building = None
    if filter is not None:
        oblast_district = filter.get('oblast_district')
        min_price = filter.get('min_price', 0)
        max_price = filter.get('max_price', 0)
        new_building = filter.get('new_building', None)

    update_date = session.pop('update_date', None)

    ads_filter_data = Ad.query.filter(Ad.update_date == update_date,
        or_(oblast_district is None,
            Ad.oblast_district == oblast_district),
        or_(min_price == 0, Ad.price >= min_price),
        or_(max_price == 0, Ad.price <= max_price),
        or_(new_building is None,
            or_(Ad.under_construction,
                and_(Ad.construction_year,
                     datetime.now().year -
                     Ad.construction_year <= app.config['MAX_NEW_BUILDING_AGE'])
                )
            )).paginate(page, app.config['COUNT_AD_PER_PAGE'], False)

    ads = list()
    for row in ads_filter_data.items:
        ads.append(row.as_dict())

    data = {
        'ads': ads,
        'total': ads_filter_data.total
    }
    return jsonify(data)


@app.route('/')
def ads_list():
    return render_template('ads_list.html')

if __name__ == "__main__":
    app.secret_key = "some very secret key"
    app.run()
