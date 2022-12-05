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

attraction = Blueprint("attraction", __name__)

# 取得景點資料列表API
@attraction.route("/attractions")
def attractions():
	page = int(request.args.get("page", 0))
	keyword = request.args.get("keyword", "")
	data = []
	try:
		# 沒有附帶keyword的搜尋
		if not keyword:
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor()
			sql = "SELECT * FROM attractions LIMIT %s,%s"
			val = (page*12,12)
			cursor.execute(sql,val)
			attractions = cursor.fetchall()

			images_data = []
			for image in attractions:
				images = []
				for url in image[9].split("http"):
					if url.endswith("jpg"):
						images.append("http" + url)
				images_data.append(images)
			
			for i in range(len(attractions)):
				result = {
					"id":attractions[i][0],
					"name":attractions[i][1],
					"category":attractions[i][2],
					"description":attractions[i][3],
					"address":attractions[i][4],
					"transport":attractions[i][5],
					"mrt":attractions[i][6],
					"lat":attractions[i][7],
					"lng":attractions[i][8],
					"images":images_data[i]
				}
				data.append(result)

			if (len(attractions)-12)<0:
				nextpage = None
			else:
				nextpage = page+1

		# 附帶keyword進行景點完全比對或名稱模糊比對的搜尋
		if keyword:
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor()
			sql = "SELECT * FROM attractions WHERE category = %s or name LIKE '%"+ keyword + "%' LIMIT %s,%s"
			val = (keyword,page*12, 12)
			cursor.execute(sql,val)
			attractions = cursor.fetchall()

			images_data = []
			for image in attractions:
				images = []
				for url in image[9].split("http"):
					if url.endswith("jpg"):
						images.append("http" + url)
				images_data.append(images)
			
			for i in range(len(attractions)):
				result = {
					"id":attractions[i][0],
					"name":attractions[i][1],
					"category":attractions[i][2],
					"description":attractions[i][3],
					"address":attractions[i][4],
					"transport":attractions[i][5],
					"mrt":attractions[i][6],
					"lat":attractions[i][7],
					"lng":attractions[i][8],
					"images":images_data[i]
				}
				data.append(result)
			
			if (len(attractions)-12)<0:
				nextpage = None
			else:
				nextpage = page+1

		response = make_response({"nextPage": nextpage, "data":data}, 200)
		response.headers["Content-type"] = "application/json"
		response.headers["Accept"] = "application/json"
		response.headers["Access-Control-Allow-Origin"] = "*"
		return response
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		connection_object.close()

# 根據景點編號取得景點資料API
@attraction.route("/attraction/<attractionId>")
def attraction_id(attractionId):
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		cursor.execute("SELECT * FROM attractions WHERE id = %s" %attractionId)
		attraction = cursor.fetchone()

		if attraction:

			images = []
			for url in attraction[9].split("http"):
				if url.endswith(("jpg", "png")):
					images.append("http"+url)

			result = {
				"id":attraction[0],
				"name":attraction[1],
				"category":attraction[2],
				"description":attraction[3],
				"address":attraction[4],
				"transport":attraction[5],
				"mrt":attraction[6],
				"lat":attraction[7],
				"lng":attraction[8],
				"images":images
			}

			response = make_response({"data":result}, 200)
			response.headers["Content-type"] = "application/json"
			response.headers["Accept"] = "application/json"
			response.headers["Access-Control-Allow-Origin"] = "*"
			return response
		if not attraction:
			return {
				"error": True,
				"message": "景點編號不正確"
			}, 400
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		connection_object.close()

