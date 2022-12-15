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

