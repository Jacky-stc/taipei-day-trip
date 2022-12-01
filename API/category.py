from flask import *
import mysql.connector
from mysql.connector import pooling

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

category = Blueprint("category", __name__)

# 取得景點分類名稱列表API
@category.route("/categories")
def categories():
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		cursor.execute("select distinct category from attractions")
		categories = cursor.fetchall()
		result = []

		for category in categories:
			result.append(category[0])

		response = make_response({"data":result}, 200)
		response.headers = headers

		return response
	except:
		return {"error": True, "message": "伺服器內部錯誤"}, 500
	finally:
		cursor.close()
		connection_object.close()