import mysql.connector
from mysql.connector import pooling
import re

def imageInfo(image):
    images = []
    for url in image[9].split(","):
        images.append(url)
    return images

def imagesInfo(attractions):
    images_data = []
    for image in attractions:
        images = imageInfo(image)
        images_data.append(images)
    return images_data

def  attractionLoad(attraction,images):
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
    return result

def attractionsLoad(attractions,image):
    data = []
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
            "images":image[i]
        }
        data.append(result)
    return data

def dbConnection(dbPassword):
    dbconfig = {
    "host" : "localhost",
    "user" : "root",
    "password" : dbPassword,
    "database" : "taipei_day_trip"
    }
    connection_pool = mysql.connector.pooling.MySQLConnectionPool(
	pool_name = "taipei_day_trip",
	pool_size = 5,
	pool_reset_session = True,
	**dbconfig
    )
    return connection_pool

def nameValid(name) :
    if re.match("^(?!\s*$).+", name):
        return True
    return False

def emailValid(email) :
    if re.match("^\w+@\w+(\.\w+)*\.\w+$", email):
        return True
    return False
    
def passwordValid(password) :
    if re.match("\w{8,100}", password):
        return True
    return False
    