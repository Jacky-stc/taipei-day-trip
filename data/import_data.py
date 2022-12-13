import json 
import mysql.connector
from mysql.connector import pooling

# 讀取json檔案
input_file = open('./data/taipei-attractions.json', encoding='utf-8')
json_array = json.load(input_file)
result = []
for i in range(len(json_array['result']['results'])):
    result.append(json_array['result']['results'][i]['file'].lower())

images_data = []
for i in result:
    jpg_file = [] 
    for url in i.split("http"): 
        if url.endswith(("jpg","png")): 
            jpg_file.append("http"+url) 
    images_data.append(jpg_file)


images = []
for i in range(len(images_data)):
    str_images = ""
    for data in images_data[i]:
        str_images += data
    images.append(str_images)    

print(len(images_data))


# # 連接資料庫
dbconfig = {
    "host" : "localhost",
    "user" : "root",
    "password" : "13579jacky",
    "database" : "taipei_day_trip"
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(
    pool_name = "taipei_day_trip",
    pool_size = 3,
    pool_reset_session = True,
    **dbconfig
)
try:
    connection_object = connection_pool.get_connection()
    cursor = connection_object.cursor()
    for i in range(len(json_array['result']['results'])):
        sql = "INSERT INTO attractions (name, category, description, address, transport, mrt, lat, lng) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)" 
        val =(
            json_array['result']['results'][i]['name'],
            json_array['result']['results'][i]['CAT'],
            json_array['result']['results'][i]['description'],
            json_array['result']['results'][i]['address'],
            json_array['result']['results'][i]['direction'],
            json_array['result']['results'][i]['MRT'],
            json_array['result']['results'][i]['latitude'],
            json_array['result']['results'][i]['longitude']
        )
        cursor.execute(sql, val)
        connection_object.commit()
    for i in range(len(images_data)):
        for data in images_data[i]:
            sql = "insert into images (id, image) value (%s, %s)"
            val = (i+1,data)
            cursor.execute(sql,val)
            connection_object.commit()
finally:
    cursor.close()
    connection_object.close()
