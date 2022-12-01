from flask import *

user = Blueprint("user", __name__)

@user.route("/member", methods = ['POST'])
def register():
    try:
        return {"ok": True, "method":"post"},200
    except:
        return {
            "error": True,
            "message": "no"
        }, 500
    

@user.route("/member/auth", methods = ['GET','PUT', 'DELETE'])
def auth():
    if request.method == 'GET':
        return {
            "data":{
                "id": 1,
                "name": "name",
                "email": "test@test.com"
            }
        }, 200
    
    if request.method == 'PUT':
        return {
            "ok": True,
            "method": "put"
        }, 200

    if request.method == 'DELETE':
        return {
            "ok": True,
            "method": "delete"
        }, 200
