from flask import *

import os
from API.attraction import attraction
from API.category import category
from API.user import user
from API.booking import booking
from API.orders import orders
from API.member import member


app=Flask(
	__name__,
	static_folder= "static",
	static_url_path="/"
)
app.secret_key = os.urandom(20)

app.register_blueprint(attraction, url_prefix = "/api")
app.register_blueprint(category, url_prefix = "/api")
app.register_blueprint(user, url_prefix = "/api")
app.register_blueprint(booking, url_prefix = "/api")
app.register_blueprint(orders, url_prefix = "/api")
app.register_blueprint(member, url_prefix = "/api")


app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/member")
def user():
	return render_template("member.html")



if __name__ == '__main__':
	app.run(host='0.0.0.0', port=3000, debug=True)