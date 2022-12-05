from flask import *
import mysql.connector
from mysql.connector import pooling
import jwt
from datetime import datetime, timedelta

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

user = Blueprint("user", __name__)

# 註冊會員帳號
@user.route("/user", methods = ['POST'])
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
	

@user.route("/user/auth", methods = ['GET','PUT', 'DELETE'])
def auth():
	# 取得當前登入會員資訊
	if request.method == 'GET':
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		try:
			JWTtoken = request.cookies.get('JWTtoken')
			if JWTtoken:
				docoded_token = jwt.decode(JWTtoken, "8df817d973ca4e33a6e394da0ded4f3a", algorithms="HS256")
				sql = "SELECT * FROM user WHERE id = %s "
				val = (docoded_token["id"], )
				cursor.execute(sql,val)
				result = cursor.fetchone()
				return {
					"data":{
						"id": result[0],
						"name": result[1],
						"email": result[2]
					}
				}, 200
			else:
				return {"data":None},200
		except Exception as e:
			print(e)
			return {"error":True},500
		finally:
			cursor.close()
			connection_object.close()
	# 登入會員帳戶
	if request.method == 'PUT':
		req = request.get_json()
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		try:
			sql = "SELECT * FROM user WHERE email = %s and password = %s"
			val = (req['email'],req['password'])
			cursor.execute(sql,val)
			result = cursor.fetchone()
			if result:
				token = jwt.encode({
					"id":result[0],
					"exp": datetime.now() + timedelta(days = 7)
				},'8df817d973ca4e33a6e394da0ded4f3a', algorithm="HS256")
				response = make_response({"ok":True}, 200)
				response.headers["Content-type"] = "application/json"
				response.headers["Accept"] = "application/json"
				response.headers["Access-Control-Allow-Origin"] = "*"
				response.headers["Set-Cookie"] = "JWTtoken=%s; path=/;"%token
			if not result:
				response =  make_response({
					"error": True,
					"message": "帳號密碼錯誤，請重新輸入。"
				},400)
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
		response = make_response({"ok":True},200)
		response.headers["Set-Cookie"] = "JWTtoken=''; max-age = -1; path=/;"
		return response