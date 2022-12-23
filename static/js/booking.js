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

let attractionId = 0
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
    if(update.canGetPrime){
        submitButton.removeAttribute("disabled")
    }else{
        submitButton.setAttribute("disabled", true)
    }
})

const nameRegex = new RegExp(/^.+$/)
const emailRegex = new RegExp(/^\w+@\w+(\.\w+)*\.\w+$/)
const phoneRegex = new RegExp(/^09\d{8}$/)

submitButton.addEventListener("click", e=>{
    e.preventDefault()
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    if(tappayStatus.canGetPrime === false){
        view.showHint("Can't get prime")
        return
    }
    TPDirect.card.getPrime((result)=>{
        if(result.status !== 0){
            view.showHint(`Get prime error ${result.msg}`)
            return
        }
        const orderName = document.querySelector(".order-name").value
        const orderEmail = document.querySelector(".order-email").value
        const orderPhone = document.querySelector(".order-phone").value
        if(!nameRegex.test(orderName)){
            view.showHint("姓名欄位不能為空")
            return
        }
        if(!emailRegex.test(orderEmail)){
            view.showHint("不合法的信箱格式")
            return
        }
        if(!phoneRegex.test(orderPhone)){
            view.showHint("不合法的手機號碼格式")
            return
        }
        const orderInfoAndPrime = model.getOrderInfo(result, attractionId)
        view.showGrayscale()
        const loader = document.querySelector(".loader")
        loader.style.display = "block"
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