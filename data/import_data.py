import json 
import mysql.connector
from mysql.connector import pooling

# 讀取json檔案
input_file = open(r'~\taipei-day-trip\data\taipei-attractions.json', encoding='utf-8')
json_array = json.load(input_file)
result = []
for i in range(len(json_array['result']['results'])):
    result.append(json_array['result']['results'][i]['file'].lower())

images_data = []
for i in result:
    jpg_file = [] # 每一次大迴圈都要先將jpg_file重置，不然會變成所有資料一直疊加
    for url in i.split("http"): # 先把每段網址以http分開
        if url.endswith(("jpg","png")): # 確認每段網址是否以jpg、png做結尾
            jpg_file.append("http"+url) # 由於split的特性會將作為分開的元素自動去除，所以需要再重新加上http才會是完整的網址
    images_data.append(jpg_file)


images = []
for i in range(len(images_data)):
    str_images = ""
    for data in images_data[i]:
        str_images += data
    images.append(str_images)    


# 連接資料庫
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
        sql = "INSERT INTO attractions (id, name, category, description, address, transport, mrt, lat, lng, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)" 
        val =(
            json_array['result']['results'][i]['_id'],
            json_array['result']['results'][i]['name'],
            json_array['result']['results'][i]['CAT'],
            json_array['result']['results'][i]['description'],
            json_array['result']['results'][i]['address'],
            json_array['result']['results'][i]['direction'],
            json_array['result']['results'][i]['MRT'],
            json_array['result']['results'][i]['latitude'],
            json_array['result']['results'][i]['longitude'], 
            images[i]
        )
        cursor.execute(sql, val)
        connection_object.commit()
  
finally:
    cursor.close()
    connection_object.close()
