from flask import *
import mysql.connector
from mysql.connector import pooling
from API.model import *
from collections import namedtuple
import jwt
from dotenv import load_dotenv
import os 
import boto3
import botocore

load_dotenv()

member = Blueprint("member", __name__)

dbPassword = os.getenv("dbPassword")
JWTsecretKey = os.getenv("JWTsecretKey")
accessKeyId = os.getenv("accessKeyId")
secretAccessKey = os.getenv("secretAccessKey")

connection_pool = dbConnection(dbPassword)

@member.route("/member", methods = ["GET"])
def memberOrderList():
    JWTtoken = request.cookies.get("JWTtoken")
    try:
        if JWTtoken:
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
            data_dict = {}
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
            return data_dict, 200
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        if connection_object.is_connected():
            cursor.close()
            connection_object.close()

@member.route("/member/s3", methods = ['GET', 'POST'])
def getS3Access():
    JWTtoken = request.cookies.get("JWTtoken")
    if JWTtoken:
        try:
            s3_client = boto3.client(
                's3', 
                region_name = "ap-northeast-1", 
                config = boto3.session.Config(signature_version='s3v4'),
                aws_access_key_id = accessKeyId,
                aws_secret_access_key = secretAccessKey
            )
            decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms="HS256")
            user = decodedToken['id']
            if request.method == 'GET':
                objects = s3_client.list_objects(Bucket = "stctaipeidaytrip", Prefix = str(user) + '.jpg')
                if 'Contents' in objects:
                    image_url = s3_client.generate_presigned_url('get_object', Params = {
                        'Bucket': 'stctaipeidaytrip',
                        'Key': str(user) + '.jpg'
                    }, ExpiresIn = 3600)
                else:
                    image_url = None
                return {"data": image_url}, 200
            if request.method == 'POST':
                if 'file' in request.files:
                    file = request.files['file']
                    s3_client.upload_fileobj(file, "stctaipeidaytrip", str(user) + ".jpg")
                    return {"ok": True, "message": "檔案上傳成功"}, 200
                else:
                    return {"ok": True, "message": "無檔案"}, 200
        except Exception as e:
            print(e)
            return {"error": True, "message": "伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "未登入系統，存取遭拒"}, 403

@member.route("/member/info", methods = ['GET','POST'])
def getMemberInfo():
    JWTtoken = request.cookies.get("JWTtoken")
    if JWTtoken:
        try:
            decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms="HS256")
            user = decodedToken['id']
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor(dictionary = True)
            if request.method == "GET":
                sql = """
                    SELECT * FROM member WHERE id = %s
                """
                val = (user, )
                cursor.execute(sql, val)
                member_info = cursor.fetchone()
                response = {
                    "member":{
                        "name": member_info['name'],
                        "birth": member_info['birth'],
                        "gender": member_info['gender'],
                        "phone": member_info['phone'],
                        "email": member_info['email']
                    }
                }
                return response, 200
            if request.method == "POST":
                req = request.get_json()
                name = req['name']
                birth = req['birth']
                gender = req['gender']
                phone = req['phone']
                email = req['email']
                sql = """
                    REPLACE INTO member(id, name, birth, gender, phone, email) VALUE(%s, %s, %s, %s, %s, %s)
                """
                val = (user, name, birth, gender, phone, email)
                cursor.execute(sql, val)
                connection_object.commit()
                return {"ok": True}, 200
        except Exception as e:
            print(e)
            return {"error": True, "message": "伺服器內部錯誤"}, 500
        finally:
            if connection_object.is_connected():
                cursor.close()
                connection_object.close()
    else:
        return {"error": True, "message": "未登入系統，存取遭拒"}, 403
