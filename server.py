from flask import Flask, render_template, request, jsonify, session
from sqlalchemy.sql.expression import func
from datetime import datetime
from sqlalchemy import or_, and_
import json
import os

app = Flask(__name__)
from ad_model import db, Ad

basedir = os.path.abspath(os.path.dirname(__file__))
base_database_uri = 'sqlite:///' + os.path.join(basedir, 'rdb.db')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI",
                                                  base_database_uri)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
DEFAULT_DB_SOURCE_PATH = os.getenv("DEFAULT_DB_SOURCE_PATH",
                                   "https://devman.org/assets/ads.json")
PASSWORD_FOR_DB_UPDATE = os.getenv("PASSWORD_FOR_DB_UPDATE", "123456")
AVERAGE_PAGE = 7
DEFAULT_BUILDING_AGE = 2
COUNT_AD_PER_PAGE = os.getenv("COUNT_AD_PER_PAGE", AVERAGE_PAGE)
MAX_NEW_BUILDING_AGE = os.getenv("MAX_NEW_BUILDING_AGE", DEFAULT_BUILDING_AGE)
BAD_REQUEST_STATUS_CODE = 400
FORBIDDEN_STATUS_CODE = 401
FIRST_PAGE = 1
ZERO = 0

db.create_all()


def bad_request(error_text=None, error_status=BAD_REQUEST_STATUS_CODE):
    if error_text is None:
        error_text = 'Bad request: %s' % request.url
    error_message = {
        'status': error_status,
        'message': error_text
    }
    return app.response_class(
        response=json.dumps(error_message),
        status=error_status,
        mimetype='application/json'
    )


def import_item_to_db(ad_db_item, ad_json_item, datetime_import):
    any_value_imported = False
    for ad_key, ad_value in ad_json_item.items():
        if hasattr(ad_db_item, ad_key):
            if isinstance(ad_value, str):
                ad_value = ' '.join(ad_value.split())
            setattr(ad_db_item, ad_key, ad_value)
            any_value_imported = True
    if any_value_imported:
        # update date - key for search last items!
        setattr(ad_db_item, 'update_date', datetime_import)
        db.session.add(ad_db_item)
    return any_value_imported


def import_json_to_db(ads_set):
    any_item_imported = False
    datetime_import = datetime.now().replace(microsecond=ZERO)
    for ad in ads_set:
        ad_db_item = Ad.query.filter_by(id=ad.get('id')).first()
        if ad_db_item is None:
            ad_db_item = Ad()
        if import_item_to_db(ad_db_item, ad, datetime_import):
            any_item_imported = True
    if any_item_imported:
        db.session.commit()
    return any_item_imported, datetime_import


@app.route('/check_db_pass', methods=['POST'])
def check_database_password():
    password = request.json.get('password')
    if password == PASSWORD_FOR_DB_UPDATE:
        return jsonify()
    else:
        return bad_request()


@app.route('/update_database', methods=['POST'])
def update_database():
    if request.json.get('password') == PASSWORD_FOR_DB_UPDATE:
        json_ad_item = json.loads(request.json.get('flats-data'))
        if json_ad_item is not None:
            import_succeed, date_import = import_json_to_db(json_ad_item)
            if import_succeed:
                update_status = {
                    'update_message': 'update_succeed',
                    'update_datetime': date_import
                }
                return jsonify(update_status)
            else:
                return bad_request('no data imported')
    else:
        return bad_request('password mismatch',
                           error_status=FORBIDDEN_STATUS_CODE)


@app.route('/')
def ads_list():
    page = request.args.get('page', FIRST_PAGE, type=int)
    district = request.args.get('oblast_district')
    min_price = request.args.get('min_price', ZERO, type=int)
    max_price = request.args.get('max_price', ZERO, type=int)
    new_building = request.args.get('new_building', None)

    # update date - key for search last items!
    # filter data only with the last import date
    stored_date = db.session.query(Ad.update_date,
                                   func.max(Ad.update_date)).one()
    update_date = None
    if stored_date.update_date is not None:
        update_date = stored_date.update_date

    ads_filter_data = \
        db.session.query(Ad).filter(
            Ad.update_date == update_date,
            or_((district is None or not district),
                Ad.oblast_district == district),
            or_(min_price == ZERO, Ad.price >= min_price),
            or_(max_price == ZERO, Ad.price <= max_price),
            or_((new_building is None or new_building is False),
                or_(Ad.under_construction,
                    and_(Ad.construction_year,
                         datetime.now().year -
                         Ad.construction_year <= MAX_NEW_BUILDING_AGE)
                    )
                )).paginate(page, COUNT_AD_PER_PAGE, False)

    if update_date is None:
        update_date = 'not updated'

    return render_template('ads_list.html',
                           ads=ads_filter_data,
                           oblast_district=district,
                           new_building=new_building,
                           min_price=min_price,
                           max_price=max_price,
                           update_date=update_date,
                           data_path='')


if __name__ == "__main__":
    app.secret_key = "some very secret key"
    app.run()
