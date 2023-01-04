from flask import *
import mysql.connector
from mysql.connector import pooling
from API.model import *
import os
from dotenv import load_dotenv
load_dotenv()

dbPassword = os.getenv("dbPassword")
connection_pool = dbConnection(dbPassword)

category = Blueprint("category", __name__)

# 取得景點分類名稱列表API
@category.route("/categories")
def categories():
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor(dictionary = True)
		cursor.execute("select distinct category from attractions")
		categories = cursor.fetchall()
		result = []

		for category in categories:
			result.append(category['category'])

		response = make_response({"data":result}, 200)
		response.headers["Content-type"] = "application/json"
		response.headers["Accept"] = "application/json"
		response.headers["Access-Control-Allow-Origin"] = "*"
		return response
	except:
		return {"error": True, "message": "伺服器內部錯誤"}, 500
	finally:
		cursor.close()
		connection_object.close()