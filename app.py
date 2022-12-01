from flask import *
from api import api
import os

app=Flask(
	__name__,
	static_folder= "static",
	static_url_path="/"
)
app.secret_key = os.urandom(20)
app.register_blueprint(api, url_prefix = "/api")

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

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=3000, debug=True)