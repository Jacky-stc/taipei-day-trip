import * as model from "./model.js"
import * as view from "./view.js"

model.fetchUrl("api/user/auth","GET", view.bookingUser)
model.fetchUrl("/api/booking", "GET", view.bookingPage)

view.mainResize()

const deleteOrder = document.querySelector(".delete")
const deleteBlock = document.querySelector(".delete-block")
const grayscale = document.querySelector(".grayscale")
const nowHeight = document.body.scrollHeight
deleteOrder.addEventListener("click", ()=>{
    deleteBlock.style.display = "block"
    grayscale.style.height = `${nowHeight}px`
    grayscale.style.display = "block"
})
const deleteConfirm = document.querySelector(".delete-confirm")
const deleteCancel = document.querySelector(".delete-cancel")
deleteConfirm.addEventListener("click", ()=>{
    model.fetchUrl("/api/booking","DELETE", view.deleteMessage)
})
deleteCancel.addEventListener("click", ()=>{
    deleteBlock.style.display = "none"
    grayscale.style.display = "none"
})

let attractionId = 4
async function getAttractionId(){
    const fetchData = await fetch("/api/booking", {method:"GET"})
    const fetchResponse = await fetchData.json()
    attractionId = fetchResponse.data.attraction.id
}
getAttractionId()


TPDirect.setupSDK(126929, 'app_7amv7NGgGJDRVUonoDMQjlQdDZd4NJ5rJXoue0467HFEk8F9j9OuSb6xwTio', 'sandbox')
let fields = {
    number: {
        element: document.getElementById("card-number"),
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: document.getElementById('card-ccv'),
        placeholder: 'ccv'
    }
}
TPDirect.card.setup({
    fields: fields,
    styles: {
        'input': {
            'color': 'gray'
        },
        'input.ccv': {
            'font-size': '16px'
        },
        'input.expiration-date': {
            'font-size': '16px'
        },
        'input.card-number': {
            'font-size': '16px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        }
    },
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
})
const submitButton = document.querySelector(".order_btn")
TPDirect.card.onUpdate(function(update){
    console.log(update.canGetPrime)
    if(update.canGetPrime){
        submitButton.removeAttribute("disabled")
    }else{
        submitButton.setAttribute("disabled", true)
    }
})


submitButton.addEventListener("click", e=>{
    e.preventDefault()
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    if(tappayStatus.canGetPrime === false){
        alert("cant get prime")
        return
    }
    TPDirect.card.getPrime((result)=>{
        if(result.status !== 0){
            alert(`get prime error ${result.msg}`)
            return
        }
        const grayscale_div = document.querySelector(".grayscale")
        const nowHeight = document.querySelector("body").scrollHeight
        grayscale_div.style.height = `${nowHeight}px`
        grayscale_div.style.display = "block"
        const loader = document.querySelector(".loader")
        loader.style.display = "block"
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
        async function sendPrime(){
            const fetchData = await fetch("/api/orders", {
                method:"POST",
                headers:{
                    'Content-type' :'application/json; charset=UTF-8',
                    'Accept':'application/json'
                },
                body:JSON.stringify(orderInfoAndPrime)
            })
            const fetchResponse = await fetchData.json()
            location.href = `/thankyou?number=${fetchResponse.data.number}`
        }
        sendPrime()
    })
})