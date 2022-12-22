// Fetch
export async function fetchUrl(url,method,callback){
    const fetchData = await fetch(url,{method:method})
    const fetchResponse = await fetchData.json()
    callback(fetchResponse)
    return fetchResponse
}
// 註冊資料
export const register_info = {
    "name":document.querySelector("#register_name").value,
    "email":document.querySelector("#register_email").value,
    "password":document.querySelector("#register_password").value
}
// 登入資料
export const login_info = {
    "email": document.querySelector("#login_email").value,
    "password":document.querySelector("#login_password").value
}
// 預定資料
export function getBookingInfo(){
    const attraction_id = window.location.pathname.replace("/attraction/","");
    const date = document.querySelector(".date").value
    let price = 0;
    if(document.querySelector("#money").textContent === "新台幣2000元"){
        price = 2000
    }
    if(document.querySelector("#money").textContent === "新台幣2500元"){
        price = 2500
    }
    let time = "";
    if(document.querySelector("#money").textContent === "新台幣2000元"){
        time = "上半天"
    }
    if(document.querySelector("#money").textContent === "新台幣2500元"){
        time = "下半天"
    }
    const bookingInfo = {
        "attractionId": attraction_id,
        "date":date,
        "time":time,
        "price":price
    }
    return bookingInfo

}
export function getOrderInfo(){
    const orderName = document.querySelector(".order-name").value
    const orderEmail = document.querySelector(".order-email").value
    const orderPhone = document.querySelector(".order-phone").value
    const name = document.querySelector(".attraction_title").textContent.slice(7)
    const date = document.querySelector(".date").textContent
    const time = document.querySelector(".time").textContent
    const price = document.querySelector(".price").textContent.slice(4,-1)
    const address = document.querySelector(".address").textContent
    const image = document.querySelector(".attraction_img").src
    const orderInfoAndPrime = {
        "prime": result.card.prime,
        "order":{
            "price": Number(price),
            "trip":{
                "attraction":{
                    "id": attractionId,
                    "name": name,
                    "address": address,
                    "image": image
                },
                "date": date,
                "time": time
            },
            "contact": {
                "name": orderName,
                "email": orderEmail,
                "phone": orderPhone
            }
        }
    }
    return orderInfoAndPrime
}