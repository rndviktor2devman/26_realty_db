from flask import Flask, render_template, request, jsonify
import json
import config

app = Flask(__name__)
app.config.from_object('config')
from ad_model import db, Ad
db.create_all()


def forbidden_access():
    message = {
        'status': 403,
        'message': 'Forbidden:' + request.url
    }
    return app.response_class(
        response=json.dumps(message),
        status=403,
        mimetype='application/json'
    )


@app.route('/check_db_pass', methods=['POST'])
def check_database_password():
    password = request.json['password']
    if password == config.password_for_update_db:
        return jsonify()
    else:
        return forbidden_access()


@app.route('/get_database_status', methods=['GET'])
def get_database_status():
    data = {
        'path': config.default_db_source_path,
        'update_datetime': 'default_datetime'
    }
    return jsonify(data)


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
