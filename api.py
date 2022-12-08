from flask import *

from API.attraction import attraction
from API.category import category
from API.user import user

api = Blueprint("api", __name__)

api.register_blueprint(attraction, url_prefix = "")
api.register_blueprint(category, url_prefix = "")
api.register_blueprint(user, url_prefix = "")
