from flask import *
import mysql.connector
app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

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


# 取得景點資料列表
@app.route("/api/attractions")
def attractions():
	page = int(request.args.get("page", 0))
	keyword = request.args.get("keyword", "")
	data = []
	try:
		if keyword == "":
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor()
			sql = "SELECT * FROM attractions LIMIT %s,%s"
			val = (page*12,12)
			cursor.execute(sql,val)
			attractions = cursor.fetchall()

			images_resource = []
			for i in range(len(attractions)):
				images_resource.append(attractions[i][9])

			images_data = []
			for i in range(len(images_resource)):
				images = []
				for url in images_resource[i].split("http"):
					if url.endswith(("jpg", "png")):
						images.append("http"+url)
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
		else:
			connection_object = connection_pool.get_connection()
			cursor = connection_object.cursor()
			sql = "SELECT * FROM attractions WHERE name LIKE '%"+ keyword + "%' LIMIT %s,%s"
			val = (page*12, 12)
			cursor.execute(sql,val)
			attractions = cursor.fetchall()

			images_resource = []
			for i in range(len(attractions)):
				images_resource.append(attractions[i][9])
			# print(images_data)

			images_data = []
			for i in range(len(images_resource)):
				images = []
				for url in images_resource[i].split("http"):
					if url.endswith(("jpg", "png")):
						images.append("http"+url)
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

		response = make_response({"nextPage": page+1, "data":data}, 200)
		headers = {
				"Content-type":"application/json",
				"Accept": "application/json",
				"Access-Control-Allow-Origin":"*"
		}
		response.headers = headers
		return response
	except:
		return {
			"error": True,
			"message": "伺服器內部錯誤"
		}, 500
	finally:
		cursor.close()
		connection_object.close()

# 根據景點編號取得景點資料
@app.route("/api/attraction/<attractionId>")
def attraction_id(attractionId):
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		cursor.execute("SELECT * FROM attractions WHERE id = %s" %attractionId)
		attraction = cursor.fetchone()

		if attraction != None:

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

			headers = {
				"Content-type":"application/json",
				"Accept": "application/json",
				"Access-Control-Allow-Origin":"*"
			}

			response = make_response({"data":result}, 200)
			response.headers = headers
			return response
		if attraction == None:
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



# 取得景點分類名稱列表
@app.route("/api/categories")
def categories():
	try:
		connection_object = connection_pool.get_connection()
		cursor = connection_object.cursor()
		cursor.execute("select distinct category from attractions")
		categories = cursor.fetchall()
		result = []

		for i in categories:
			result.append(i[0])
		print(result)
		headers = {
			"Content-type":"application/json",
			"Accept": "application/json",
			"Access-Control-Allow-Origin":"*"
		}

		response = make_response(jsonify({"data":result}), 200)
		response.headers = headers

		return response

	except:
		return {"error": True, "message": "伺服器內部錯誤"}, 500
	finally:
		cursor.close()
		connection_object.close()


app.run(port=3000, debug=True)