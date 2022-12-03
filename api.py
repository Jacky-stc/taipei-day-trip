from flask import *
import mysql.connector
from mysql.connector import pooling

from API.attraction import attraction
from API.category import category


dbconfig = {
    "host" : "localhost",
    "user" : "root",
    "password" : "",
    "database" : "taipei_day_trip"
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "taipei_day_trip",
    pool_size = 5,
    pool_reset_session = True,
    **dbconfig
)

api = Blueprint("api", __name__)

api.register_blueprint(attraction, url_prefix = "")
api.register_blueprint(category, url_prefix = "")

