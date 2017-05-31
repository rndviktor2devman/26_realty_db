from flask import Flask, render_template, request, jsonify, session
from sqlalchemy.sql.expression import func
from datetime import datetime
from sqlalchemy import or_, and_
import json
import re
import requests
import os

app = Flask(__name__)
basedir = os.path.abspath(os.path.dirname(__file__))
base_database_uri = 'sqlite:///' + os.path.join(basedir, 'rdb.db')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI", base_database_uri)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DEFAULT_DB_SOURCE_PATH = os.getenv("DEFAULT_DB_SOURCE_PATH", "https://devman.org/assets/ads.json")
PASSWORD_FOR_DB_UPDATE = os.getenv("PASSWORD_FOR_DB_UPDATE", "123456")
COUNT_AD_PER_PAGE = os.getenv("COUNT_AD_PER_PAGE", 7)
MAX_NEW_BUILDING_AGE = os.getenv("MAX_NEW_BUILDING_AGE", 2)

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


def import_item_to_db(ad_db_item, ad_json_item, datetime_import):
    any_value_imported = False
    for ad_key, ad_value in ad_json_item.items():
        if hasattr(ad_db_item, ad_key):
            if isinstance(ad_value, str):
                ad_value = ' '.join(ad_value.split())
            setattr(ad_db_item, ad_key, ad_value)
            any_value_imported = True
    if any_value_imported:
        setattr(ad_db_item, 'update_date', datetime_import)
        db.session.add(ad_db_item)
    return any_value_imported


def import_json_to_db(new_ads):
    any_item_imported = False
    datetime_import = datetime.now().replace(microsecond=0)
    for ad in new_ads:
        ad_db_item = Ad.query.filter_by(id=ad.get('id')).first()
        if ad_db_item is None:
            ad_db_item = Ad()
        if import_item_to_db(ad_db_item, ad, datetime_import):
            any_item_imported = True
    if any_item_imported:
        session['update_date'] = datetime_import
        db.session.commit()
    return any_item_imported, datetime_import


@app.route('/check_db_pass', methods=['POST'])
def check_database_password():
    password = request.json.get('password')
    if password == config.PASSWORD_FOR_DB_UPDATE:
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
    database_state = {
        'path': DEFAULT_DB_SOURCE_PATH,
        'update_datetime': last_update_time
    }
    return jsonify(database_state)


@app.route('/update_database', methods=['POST'])
def update_database():
    if request.json.get('password') == PASSWORD_FOR_DB_UPDATE:
        json_ad, error = parse_json_source(request.json.get('path'))
        if json_ad is not None:
            success_import, date_import = import_json_to_db(json_ad)
            if success_import:
                update_status = {
                    'update_message': 'update_succeed',
                    'update_datetime': date_import
                }
                return jsonify(update_status)
            else:
                return bad_request('no data imported')
    else:
        return bad_request('password mismatch', error_type=1)


@app.route('/')
def ads_list():
    page = request.args.get('page', 1, type=int)
    oblast_district = request.args.get('oblast_district')
    min_price = request.args.get('min_price', 0, type=int)
    max_price = request.args.get('max_price', 0, type=int)
    new_building = request.args.get('new_building', None)

    update_date = session['update_date']

    ads_filter_data = db.session.query(Ad).filter(Ad.update_date == update_date,
          or_((oblast_district is None or not oblast_district),
              Ad.oblast_district == oblast_district),
          or_(min_price == 0, Ad.price >= min_price),
          or_(max_price == 0, Ad.price <= max_price),
          or_((new_building is None or new_building is False),
              or_(Ad.under_construction,
                  and_(Ad.construction_year,
                       datetime.now().year -
                       Ad.construction_year <= MAX_NEW_BUILDING_AGE)
                  )
              )).paginate(page, COUNT_AD_PER_PAGE, False)

    return render_template('ads_list.html', ads=ads_filter_data,
                           oblast_district=oblast_district, new_building=new_building,
                           min_price=min_price, max_price=max_price)

if __name__ == "__main__":
    app.secret_key = "some very secret key"
    app.run()
