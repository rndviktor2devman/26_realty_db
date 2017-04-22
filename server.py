from flask import Flask, render_template, request, jsonify
from sqlalchemy.sql.expression import func
from datetime import datetime
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
    datetime_import = datetime.now()
    for ad in new_ads:
        ad_item = Ad.query.filter_by(id=ad.get('id')).first()
        if ad_item is None:
            ad_item = Ad()
        any_value_imported = False
        for key, value in ad.items():
            if hasattr(ad_item, key):
                setattr(ad_item, key, value)
                any_value_imported = True
        if any_value_imported:
            setattr(ad_item, 'update_date', datetime_import)
            db.session.add(ad_item)
            any_item_imported = True
    if any_item_imported:
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


@app.route('/')
def ads_list():
    return render_template('ads_list.html', ads=[{
            "settlement": "Череповец",
            "under_construction": False,
            "description": '''Квартира в отличном состоянии. Заезжай и живи!''',
            "price": 2080000,
            "oblast_district": "Череповецкий район",
            "living_area": 17.3,
            "has_balcony": True,
            "address": "Юбилейная",
            "construction_year": 2001,
            "rooms_number": 2,
            "premise_area": 43.0,
        }]*10
    )

if __name__ == "__main__":
    app.run()
