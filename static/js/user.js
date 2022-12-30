import * as view from "./view.js"
import * as model from "./model.js"

// 登入驗證程序
model.fetchUrl("/api/user/auth","get",view.userCheck)

// 前端註冊驗證
const register_name = document.querySelector("#register_name")
register_name.addEventListener("input", ()=>{
    view.nameCheck()
})
const register_email = document.querySelector("#register_email")
register_email.addEventListener("input", ()=>{
    view.emailCheck()
})
const register_password = document.querySelector("#register_password")
register_password.addEventListener("input", ()=>{
    view.passwordCheck()
})

// 註冊程序
const register_btn = document.querySelector(".register_btn")

register_btn.addEventListener("click",()=>{
    const register_info = {
        "name":document.querySelector("#register_name").value,
        "email":document.querySelector("#register_email").value,
        "password":document.querySelector("#register_password").value
    }
    async function registerCheck(){
        const fetchData = await fetch("/api/user",{
            method:"post",
            headers: {
            'Content-type' :'application/json; charset=UTF-8',
            'Accept':'application/json'
            },
            body: JSON.stringify(register_info)})
        const fetchResponse = await fetchData.json()
        view.registerHint(fetchResponse)
    }
    registerCheck()
})
// 登入程序
const login_btn = document.querySelector(".login_btn")
login_btn.addEventListener("click",()=>{
    const login_info = {
        "email": document.querySelector("#login_email").value,
        "password":document.querySelector("#login_password").value
    }
    async function loginCheck(){
        const fetchData = await fetch("/api/user/auth",{
            method:"put",
            headers: {
            'Content-type' :'application/json; charset=UTF-8',
            'Accept':'application/jason'
            },
            body: JSON.stringify(login_info)})
        const fetchResponse = await fetchData.json()
        view.loginHint(fetchResponse)
    }
    loginCheck()
})

// 顯示登入區塊
const signin = document.querySelector(".signin")
signin.addEventListener("click", ()=>{
    if(signin.textContent == "登入/註冊"){
        view.showLoginArea()
    }
    else{
        model.fetchUrl("/api/user/auth","delete",view.reload)
    }
})
const login_background = document.querySelector(".login_background")
login_background.classList.remove("noshow")
login_background.addEventListener("click", ()=>{
    view.showLoginArea()
})
// 關閉按鈕
const close_btn = document.querySelector(".close")
close_btn.addEventListener("click", (e)=>{
    view.closeLoginArea()
    e.stopPropagation()
})
// 切換註冊區塊
const switch_to_register = document.querySelector(".switch_to_register")
switch_to_register.addEventListener("click",()=>{
    view.switchToRegister()
})
// 切換登入區塊
const switch_to_login = document.querySelector(".switch_to_login")
switch_to_login.addEventListener("click",()=>{
    view.switchToLogin()
})
// 購物車
const shoppingBlock = document.querySelector(".shopping-block")
const cartContainer = document.querySelector(".cart-container")
cartContainer.addEventListener("mouseover",()=>{
    shoppingBlock.style.display = "block"
})
shoppingBlock.addEventListener("mouseover",()=>{
    shoppingBlock.style.display = "block"
})
window.addEventListener("mouseover", ()=>{
    shoppingBlock.style.display = "none"
},true)
// 查看預訂行程
const checkOrder = document.querySelector(".check-order")
checkOrder.addEventListener("click",()=>{
    model.fetchUrl("/api/user/auth", "get", view.userCheck)
    .then(data=>{
        if(data.data === null){
            view.showLoginArea()
        }else{
            location.href = "/booking"
        }
    })
})
model.fetchUrl("/api/booking", "get", view.shoppingCart)


