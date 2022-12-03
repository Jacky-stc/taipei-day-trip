from flask import *
from api import api
import os
import mysql.connector
from mysql.connector import pooling
import jwt
from datetime import datetime, timedelta
import requests
# from flask_jwt_extended import *



dbconfig = {
	"host" : "localhost",
	"user" : "root",
	"password" : "13579jacky",
	"database" : "taipei_day_trip"
}
connection_pool = mysql.connector.pooling.MySQLConnectionPool(
	pool_name = "taipei_day_trip",
	pool_size = 5,
	pool_reset_session = True,
	**dbconfig
)

headers = {
	"Content-type":"application/json",
	"Accept": "application/json",
	"Access-Control-Allow-Origin":"*"
}

app=Flask(
	__name__,
	static_folder= "static",
	static_url_path="/"
)
app.secret_key = os.urandom(20)
app.register_blueprint(api, url_prefix = "/api")

app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

app.config['SECRET_KEY'] = 'MY_SECRET_KEY'

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

# 註冊會員帳號
@app.route("/api/user", methods = ['POST'])
def register():
	req = request.get_json()
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		sql = "SELECT * FROM user WHERE email = %s"
		val = (req['email'], )
		cursor.execute(sql,val)
		result = cursor.fetchone()

		if not result:
			sql = "INSERT INTO user (name, email, password) VALUE(%s,%s,%s)"
			val = (req['name'],req['email'],req['password'])
			cursor.execute(sql,val)
			connection_object.commit()
			return {"ok": True, "method":"post"},200
		else:
			return {
				"error": True,
				"message":"註冊失敗，重複的Email或其他原因，請重新註冊"
			},400
	except Exception as e:
		print(e)
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		connection_object.close()
	

@app.route("/api/user/auth", methods = ['GET','PUT', 'DELETE'])
def auth():
	# 取得當前登入會員資訊
	if request.method == 'GET':
		session = requests.Session()
		print(session.cookies.get_dict())
		response = session.get("http://google.com")
		print(session.cookies.get_dict())
		return {
			"data":{
				"id": 1,
				"name": "name",
				"email": "test@test.com"
			}
		}, 200
	# 登入會員帳戶
	if request.method == 'PUT':
		try:
			req = request.get_json()
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor()
			sql = "SELECT * FROM user WHERE email = %s and password = %s"
			val = (req['email'],req['password'])
			cursor.execute(sql,val)
			result = cursor.fetchone()
			if not result:
				response =  make_response({
					"error": True,
					"message": "帳號密碼錯誤，請重新輸入。"
				},400)
			else:
				token = jwt.encode({
					"email": req["email"],
					"password":req["password"]
				}, 'secret', algorithm="HS256")
				response = make_response({"ok":True}, 200)
				response.headers = {
					"Content-type":"application/json",
					"Accept": "application/json",
					"Access-Control-Allow-Origin":"*",
					"Set-Cookie": "JWTtoken=%s; max-age=86400*7; path=/;"%token
				}
			return response

		except Exception as e:
			print(e)
			return {
				"error": True,
				"message": "伺服器內部錯誤"
			},500
		finally:
			cursor.close()
			connection_object.close()
				
	# 登出會員帳戶
	if request.method == 'DELETE':
		return {
			"ok": True,
			"method": "delete"
		}, 200




if __name__ == '__main__':
	app.run(host='0.0.0.0', port=3000, debug=True)