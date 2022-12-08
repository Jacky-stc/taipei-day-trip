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
    async function registerCheck(){
        let fetchData = await fetch("/api/user",{
            method:"post",
            headers: {
            'Content-type' :'application/json; charset=UTF-8',
            'Accept':'application/jason'
            },
            body: JSON.stringify(model.register_info)})
        let fetchResponse = await fetchData.json()
        view.registerHint(fetchResponse)
    }
    registerCheck()
})
// 登入程序
const login_btn = document.querySelector(".login_btn")
login_btn.addEventListener("click",()=>{
    async function loginCheck(){
        let fetchData = await fetch("/api/user/auth",{
            method:"put",
            headers: {
            'Content-type' :'application/json; charset=UTF-8',
            'Accept':'application/jason'
            },
            body: JSON.stringify(model.login_info)})
        let fetchResponse = await fetchData.json()
        view.loginHint(fetchResponse)
    }
    loginCheck()
})

// 預定頁面
const reservation_btn = document.querySelector(".reservation")
reservation_btn.addEventListener("click", ()=>{
    location.href = "/booking"
})
// 顯示登入區塊
const signin = document.querySelector(".signin")
signin.addEventListener("click", ()=>{
    if(signin.textContent == "登入/註冊"){
        view.showLoginArea()
    }
    else{
        model.fetchUrl("api/user/auth","delete",view.reload)
    }
})
const login_background = document.querySelector(".login_background")
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

