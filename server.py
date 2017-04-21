from flask import Flask, render_template, request, jsonify
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


def bad_request(error_text=None):
    if error_text is None:
        error_text = 'Bad request:' + request.url
    message = {
        'status': 400,
        'message': error_text
    }
    return app.response_class(
        response=json.dumps(message),
        status=400,
        mimetype='application/json'
    )


def parse_json_source(source_path):
    if re.match(r'^http[s]?://', source_path):
        http_answer = requests.get(source_path)
        if http_answer.status_code == requests.codes.ok:
            return http_answer.json()
    elif os.path.isfile(source_path):
        with open(source_path) as json_file:
            return json.load(json_file)

    return None


@app.route('/check_db_pass', methods=['POST'])
def check_database_password():
    password = request.json.get('password')
    if password == config.password_for_update_db:
        return jsonify()
    else:
        return bad_request()


@app.route('/get_database_status', methods=['GET'])
def get_database_status():
    data = {
        'path': config.default_db_source_path,
        'update_datetime': 'default_datetime'
    }
    return jsonify(data)


@app.route('/update_database', methods=['POST'])
def update_database():
    if request.json.get('password') == config.password_for_update_db:
        #     json_ad = parse_json_source(request.json.get('path'))
        data = {
            'update_message': 'update_succeed',
            'update_datetime': datetime.now()
        }
        return jsonify(data)
    else:
        return bad_request('password mismatch')


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
