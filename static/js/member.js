import * as view from "./view.js"
import * as model from "./model.js"

model.fetchUrl("/api/member", "GET", view.getOrderList)

view.mainResize()

const orderListTitle = document.querySelector(".order-list-title")
const orderListContainer = document.querySelector(".order-list-container")
const arrow = document.querySelector(".arrow")
orderListTitle.addEventListener("click", ()=>{
    orderListContainer.classList.toggle("expanded")
    arrow.classList.toggle("rotate")
})