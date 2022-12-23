import * as view from "./view.js"

const main = document.querySelector("main")
main.style.minHeight = `0px`
const footer = document.querySelector("footer")
footer.style.height = `${document.body.scrollHeight-447}px`  

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
const value = params.number
const orderNumber = document.querySelector(".order-number")
orderNumber.textContent = value

async function checkOrderStatus(){
    const fetchData = await fetch(`/api/orders/${value}`, {method:"get"})
    const fetchResponse = await fetchData.json()
    const orderGif = document.querySelector(".order-gif")
    const hintMessage = document.querySelector(".hint-message")
    if(fetchResponse.data.status === 0){
        orderGif.src = "/img/success.gif"
        hintMessage.textContent = "行程已預訂成功！"
    }else{
        orderGif.src = "/img/failed.gif"
        hintMessage.textContent = "付款失敗！"
    }
}
checkOrderStatus()