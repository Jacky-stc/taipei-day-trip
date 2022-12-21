from flask import *
import mysql.connector
from mysql.connector import pooling
from API.model import *
from collections import namedtuple
import jwt
from dotenv import load_dotenv
import os 

load_dotenv()

member = Blueprint("member", __name__)

dbPassword = os.getenv("dbPassword")
JWTsecretKey = os.getenv("JWTsecretKey")

connection_pool = dbConnection(dbPassword)

@member.route("/member", methods = ["GET"])
def memberOrderList():
    JWTtoken = request.cookies.get("JWTtoken")
    if JWTtoken:
        try:
            decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms="HS256")
            user = decodedToken['id']
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            sql = """
                SELECT 
                payment.orderNumber, 
                orders.date, orders.time, 
                attractions.name, 
                images.image 
                FROM payment 
                INNER JOIN orders on payment.orderNumber = orders.number 
                INNER JOIN attractions ON orders.attractionId = attractions.id 
                INNER JOIN images ON orders.attractionId = images.id 
                WHERE orders.userId = %s and payment.status = 0 
                GROUP BY orderNumber
            """
            val = (user, )
            cursor.execute(sql, val)
            result = cursor.fetchall()
            Data = namedtuple("Data", ['number', 'date', 'time', 'attractionName', 'image'])
            response_data = []
            for data in result:
                response_data.append(Data(*data))
            data_dict = {}
            for index, data in enumerate(response_data):
                data_dict[index]={
                    "number": data.number,
                    "date": data.date,
                    "time": data.time,
                    "attractionName": data.attractionName,
                    "image": data.image
                }         
            print(data_dict)
            return data_dict, 200
        except Exception as e:
            print(e)
            return {"error": True, "message": "伺服器內部錯誤"}, 500
        finally:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
            
