import mysql.connector
from mysql.connector import pooling
import re

def imageInfo(image):
    images = []
    for url in image["group_concat(images.image separator ',')"].split(","):
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
        "id":attraction['id'],
        "name":attraction['name'],
        "category":attraction['category'],
        "description":attraction['description'],
        "address":attraction['address'],
        "transport":attraction['transport'],
        "mrt":attraction['mrt'],
        "lat":attraction['lat'],
        "lng":attraction['lng'],
        "images":images
    }
    return result

def attractionsLoad(attractions,image):
    data = []
    for i in range(len(attractions)):
        result = {
            "id":attractions[i]['id'],
            "name":attractions[i]['name'],
            "category":attractions[i]['category'],
            "description":attractions[i]['description'],
            "address":attractions[i]['address'],
            "transport":attractions[i]['transport'],
            "mrt":attractions[i]['mrt'],
            "lat":attractions[i]['lat'],
            "lng":attractions[i]['lng'],
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

def phoneValid(phone):
    if re.match("^09\d{8}$", phone):
        return True
    return False