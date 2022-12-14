from flask import *
import mysql.connector
from mysql.connector import pooling
import jwt
from API.model import *
import os
from dotenv import load_dotenv
load_dotenv()

JWTsecretKey = os.getenv("JWTsecretKey")
dbPassword = os.getenv("dbPassword")

connection_pool = dbConnection(dbPassword)

booking = Blueprint("booking", __name__)

@booking.route("/booking", methods = ["GET","POST","DELETE"])
def bookingAPI():
    if request.method == "GET":
        connection_object = connection_pool.get_connection()
        cursor = connection_object.cursor()
        try:
            if "JWTtoken" in request.cookies:
                JWTtoken = request.cookies['JWTtoken']
                decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms = "HS256")
                userId = decodedToken['id']
                sql = "select attractions.id ,attractions.name, attractions.address, any_value(images.image), any_value(booking.date), any_value(booking.time), any_value(booking.price) from attractions inner join booking on attractions.id = booking.attractionId inner join images on attractions.id = images.id where booking.userId = %s group by id;"
                val = (userId, )
                cursor.execute(sql, val)
                bookingInfo = cursor.fetchone()
                if bookingInfo:
                    result = {
                        "attraction":{
                            "id":bookingInfo[0],
                            "name":bookingInfo[1],
                            "address":bookingInfo[2],
                            "image":bookingInfo[3]
                        },
                        "date":bookingInfo[4],
                        "time":bookingInfo[5],
                        "price":bookingInfo[6]
                    }
                    response = make_response({"data":result}, 200)
                else:
                    response = make_response({"data":None}, 200)
            else:
                response = make_response({"error":True,"message":"未登入系統，拒絕存取"},403)
            return response
        except Exception as e:
            print(e)
            return {"error":True,"message":"伺服器內部錯誤"}, 500
        finally:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
    
    if request.method == "DELETE":
        JWTtoken = request.cookies.get("JWTtoken")
        if JWTtoken: 
            try:
                connection_object = connection_pool.get_connection()
                cursor = connection_object.cursor()
                decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms = "HS256")
                userId = decodedToken['id']
                sql = "DELETE FROM booking WHERE userId = %s"
                val = (userId, )
                cursor.execute(sql, val)
                connection_object.commit()
                return {"ok":True},200
            except Exception as e:
                print(e)
                return {"error":True,"message":"伺服器內部錯誤"},500
            finally:
                cursor.close()
                connection_object.close()
        else:
            return {"error":True,"message":"未登入系統，拒絕存取"},403

    if request.method == "POST":
        req = request.get_json()
        attractionId = req['attractionId']
        date = req['date']
        time = req['time']  
        price = req['price']
        JWTtoken = request.cookies.get("JWTtoken")
        if attractionId==None or date=="" or time=="" or price==0:
            return {"error":True,"message":"建立失敗，輸入不正確或其他原因"},403
        if JWTtoken: 
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            try:
                decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms = "HS256")
                userId = decodedToken['id']
                cursor.execute("SELECT * FROM booking WHERE userId = %s"%userId)
                result = cursor.fetchone()
                if result:
                    sql = "UPDATE booking SET attractionId = %s, date = %s, time = %s, price = %s"
                    val = (attractionId, date, time, price)
                else:
                    sql = "INSERT INTO booking (userId, attractionId, date, time, price) VALUE (%s, %s, %s, %s, %s)"
                    val = (userId, attractionId, date, time, price)
                
                cursor.execute(sql, val)
                connection_object.commit()
                response = make_response({"ok": True},200)
                return response
            except Exception as e:
                print(e)
                return {"error":True,"message":"伺服器內部錯誤"}, 500
            finally:
                cursor.close()
                connection_object.close()
        else:
            response = make_response({
                "error":True,
                "message":"未登入系統，拒絕存取"
            }, 403)
        