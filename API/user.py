from flask import *
import mysql.connector
from mysql.connector import pooling
import jwt
from datetime import datetime, timedelta
from flask_jwt_extended import *

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
                "message":"註冊失敗，重複的Email或其他原因"
            },400
    except Exception as e:
        print(e)
        return {
            "error": True,
            "message": "no"
        }, 500
    finally:
        cursor.close()
        connection_object.close()
    

@user.route("/user/auth", methods = ['GET','PUT', 'DELETE'])
def auth():
    # 取得當前登入會員資訊
    if request.method == 'GET':
        return {
            "data":{
                "id": 1,
                "name": "name",
                "email": "test@test.com"
            }
        }, 200
    # 登入會員帳戶
    if request.method == 'PUT':
        try:
            req = request.get_json()
            connection_object = connection_pool.get_connection()
            cursor = connection_object.cursor()
            sql = "SELECT * FROM user WHERE email = %s and password = %s"
            val = (req['email'],req['password'])
            cursor.execute(sql,val)
            result = cursor.fetchone()
            if not result:
                return {
                    "error": True,
                    "message": "帳號密碼錯誤，請重新輸入。"
                },400
            else:
                access_token = create_access_token(identity=req["email"])
                refresh_token = create_refresh_token(identity=req["email"])
                response = make_response({"ok":True},200)
                set_access_cookies(response, access_token)
                set_refresh_cookies(response, refresh_token)
                # token = jwt.encode({
                #     'user': "test",
                #     "expiration": str(datetime.utcnow() + timedelta(seconds=10))
                # }, current_app.config['JWT_SECRET_KEY'])
                # print(token)
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
                

    if request.method == 'DELETE':
        return {
            "ok": True,
            "method": "delete"
        }, 200
