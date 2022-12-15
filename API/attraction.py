from flask import *
import mysql.connector
from mysql.connector import pooling
from API.model import *
import os
from dotenv import load_dotenv
load_dotenv()

dbPassword = os.getenv("dbPassword")
connection_pool = dbConnection(dbPassword)

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
			sql = """
			SELECT attractions.id, attractions.name, attractions.category, attractions.description, 
			attractions.address, attractions.transport, attractions.mrt, 
			attractions.lat, attractions.lng, group_concat(images.image separator ',') 
			FROM attractions 
			INNER JOIN images on attractions.id = images.id 
			GROUP BY attractions.id LIMIT %s,%s"""
			val = (page*12, 12)
			cursor.execute(sql,val)
			attractions = cursor.fetchall()

			image = imagesInfo(attractions)
			data = attractionsLoad(attractions,image)

			if (len(attractions)-12)<0:
				nextpage = None
			else:
				nextpage = page+1

		# 附帶keyword進行景點完全比對或名稱模糊比對的搜尋
		if keyword:
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor()
			sql = """
			SELECT attractions.id, attractions.name, attractions.category, attractions.description, 
			attractions.address, attractions.transport, attractions.mrt, attractions.lat, 
			attractions.lng, group_concat(images.image separator ',') 
			FROM attractions 
			INNER JOIN images on attractions.id = images.id 
			WHERE attractions.category = %s or attractions.name LIKE '%"+ keyword + "%' 
			group by attractions.id LIMIT %s,%s"""
			val = (keyword,page*12, 12)
			cursor.execute(sql,val)
			attractions = cursor.fetchall()

			image = imagesInfo(attractions)
			data = attractionsLoad(attractions,image)
			
			if (len(attractions)-12)<0:
				nextpage = None
			else:
				nextpage = page+1

		response = make_response({"nextPage": nextpage, "data":data}, 200)
		response.headers["Content-type"] = "application/json"
		response.headers["Accept"] = "application/json"
		response.headers["Access-Control-Allow-Origin"] = "*"
		return response
	except Exception as e:
		print(e)
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
		cursor.execute("""
		SELECT attractions.id, attractions.name, attractions.category, attractions.description, 
		attractions.address, attractions.transport, attractions.mrt, attractions.lat, 
		attractions.lng, group_concat(images.image separator ',') 
		FROM attractions 
		INNER JOIN images on attractions.id = images.id  
		WHERE attractions.id = %s group by attractions.id""" 
		%attractionId)
		attraction = cursor.fetchone()
		if attraction:
			image = imageInfo(attraction)
			data = attractionLoad(attraction,image)

			response = make_response({"data":data}, 200)
			response.headers["Content-type"] = "application/json"
			response.headers["Accept"] = "application/json"
			response.headers["Access-Control-Allow-Origin"] = "*"
			return response
		if not attraction:
			return {
				"error": True,
				"message": "景點編號不正確"
			}, 400
	except Exception as e:
		print(e)
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		connection_object.close()

