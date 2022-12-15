from flask import *

from API.attraction import attraction
from API.category import category
from API.user import user
from API.booking import booking

api = Blueprint("api", __name__)

api.register_blueprint(attraction)
api.register_blueprint(category)
api.register_blueprint(user)
api.register_blueprint(booking)
