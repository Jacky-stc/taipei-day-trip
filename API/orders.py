from flask import *
import mysql.connector
from mysql.connector import pooling
from API.model import *
from collections import namedtuple
import datetime
import requests
import jwt
import os
from dotenv import load_dotenv
load_dotenv()

dbpassword = os.getenv("dbpassword")
JWTsecretKey = os.getenv("JWTsecretKey")
partnerKey = os.getenv("partnerKey")
merchantId = os.getenv("merchantId")

connection_pool = dbConnection(dbpassword)

orders = Blueprint("orders", __name__)

@orders.route("/orders", methods = ["POST"])
def payByPrime():
    req = request.get_json()
    print(req)
    now = datetime.datetime.now()
    dt = datetime.datetime.strptime(str(now), "%Y-%m-%d %H:%M:%S.%f")
    current_time = dt.strftime("%Y%m%d%H%M%S")
    JWTtoken = request.cookies.get('JWTtoken')
    if JWTtoken:
        decodedToken = jwt.decode(JWTtoken, JWTsecretKey, algorithms = "HS256")
        userId = decodedToken['id']
        try:
            if not req['order']['contact']['phone'] or not req['order']['contact']['name'] or not req['order']['contact']['email']:
                return {"error":True, "message": "請填寫完整訊息"}, 400
            else:
                connection_object = connection_pool.get_connection()
                cursor = connection_object.cursor()
                order_sql = """
                    INSERT INTO orders(number, attractionId, date, time, price, name, email, phone, userId)
                    VALUE(%s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                order_val = (current_time, req['order']['trip']['attraction']['id'], req['order']['trip']['date'], req['order']['trip']['time'], req['order']['price'], req['order']['contact']['name'], req['order']['contact']['email'], req['order']['contact']['phone'], userId)
                cursor.execute(order_sql, order_val)
                connection_object.commit()
                payment_sql = """
                    INSERT INTO payment(orderNumber) VALUE (%s)
                """
                payment_val = (current_time, )
                cursor.execute(payment_sql, payment_val)
                connection_object.commit()

                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                data = {
                    "prime": req['prime'],
                    "partner_key": partnerKey,
                    "merchant_id": merchantId,
                    "details":"TapPay Test",
                    "amount": req['order']['price'],
                    "cardholder": {
                        "phone_number": req['order']['contact']['phone'],
                        "name": req['order']['contact']['name'],
                        "email": req['order']['contact']['email'],
                        "address":  req['order']['trip']['attraction']['address']
                    },
                    "remember": True
                }
                Headers = {
                    "Content-Type": "application/json",
                    "x-api-key": partnerKey
                }
                tappay_response = requests.post(url, headers=Headers, json=data).json()
                print(tappay_response)
                if tappay_response['status'] == 0:
                    update_sql = """
                        UPDATE payment SET status = 0, msg = %s WHERE orderNumber = %s
                    """
                    update_val = (tappay_response['msg'], current_time)
                    cursor.execute(update_sql, update_val)
                    connection_object.commit()
                    update_sql = """
                        UPDATE booking SET status = 0 WHERE userId = %s
                    """
                    update_val = (userId, )
                    cursor.execute(update_sql, update_val)
                    connection_object.commit()
                    return {
                        "data":{
                            "number": current_time,
                            "payment":{
                                "status": 0,
                                "message": "付款成功"
                            }
                        }
                    }, 200
                else:
                    update_sql = """
                        UPDATE payment SET status = %s, msg = %s WHERE orderNumber = %s
                    """
                    update_val = (tappay_response['status'], tappay_response['msg'], current_time)
                    cursor.execute(update_sql, update_val)
                    connection_object.commit()
                    return {
                        "data":{
                            "number": current_time,
                            "payment":{
                                "status": tappay_response['status'],
                                "message": "付款失敗"
                            }
                        }
                    }, 200 
        except Exception as e:
            print(e)
            return {"error":True,"message":"伺服器內部錯誤"}, 500
    else:
        return {"error": True, "message": "未登入系統，拒絕存取"}, 403

@orders.route("/orders/<orderNumber>", methods = ['GET'])
def getOrderInfo(orderNumber):
    JWTtoken = request.cookies.get("JWTtoken")
    try:
        if JWTtoken:
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            sql = """
                SELECT 
                orders.*,  
                attractions.name, attractions.address, 
                images.image,
                payment.status
                FROM orders 
                INNER JOIN attractions on orders.attractionId = attractions.id 
                INNER JOIN images on orders.attractionId = images.id 
                INNER JOIN payment ON orders.number = payment.orderNumber
                WHERE orders.number = %s
                GROUP BY id;
            """
            val = (orderNumber, )
            cursor.execute(sql, val)
            result = cursor.fetchone()
            if result:
                Data = namedtuple("Data", ['id', 'orderNum', 'attractionId', 'date', 'time', 'price','orderName', 'orderEmail', 'orderPhone', 'userId', 'attradtionName', 'attractionAddress', 'attractionImg', 'status'])
                response_data = Data(*result)
                response = {
                    "data": {
                        "number": response_data.orderNum,
                        "price": int(response_data.price),
                        "trip": {
                        "attraction": {
                            "id": int(response_data.attractionId),
                            "name": response_data.attradtionName,
                            "address": response_data.attractionAddress,
                            "image": response_data.attractionImg
                        },
                        "date": response_data.date,
                        "time": response_data.time
                        },
                        "contact": {
                        "name": response_data.orderName,
                        "email": response_data.orderEmail,
                        "phone": response_data.orderPhone
                        },
                        "status": int(response_data.status)
                    }
                }
                return response, 200
            else:
                return {"data": None}, 200
        else:
            return {"error": True, "message": "未登入系統，拒絕存取"}, 403
    except Exception as e:
        print(e)
        return {"error": True, "message": "伺服器內部錯誤"}, 500
    finally:
        if connection_object.is_connected():
            cursor.close()
            connection_object.close()





