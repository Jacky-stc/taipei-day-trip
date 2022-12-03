// 註冊程序
const register_btn = document.querySelector(".register_btn")
register_btn.addEventListener("click",()=>{
    let register_info = {
        "name":register_form.name.value.toString(),
        "email":register_form.email.value.toString(),
        "password":register_form.password.value.toString()
    }
    fetch("/api/user",{
        method:'post',
        headers: {
            'Content-type' :'application/json; charset=UTF-8',
            'Accept':'application/jason'
        },
        body: JSON.stringify(register_info)
    })
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        if(data["ok"]){
            alert("註冊成功!")
            location.href = "/"
        }else{
            alert(data["message"])
        }
    })
})
// 登入程序
const login_btn = document.querySelector(".login_btn")
login_btn.addEventListener("click",()=>{
    let login_info = {
        "email": login_form.email.value.toString(),
        "password":login_form.password.value.toString()
    }
    fetch("/api/user/auth", {
        method:"PUT",
        headers: {
            'Content-type' :'application/json; charset=UTF-8',
            'Accept':'application/jason'
        },
        body: JSON.stringify(login_info)
    }).then(response=>{
        return response.json()
    }).then(data=>{
        if(data["ok"]){
            location.href = "/"
        }else{
            alert(data["message"])
        }
        
    })
})


const grayscale_div = document.querySelector(".grayscale")
const login_background = document.querySelector(".login_background")
const signin = document.querySelector(".signin")
const close_btn = document.querySelector(".close")
const reservation_btn = document.querySelector(".reservation")
const login = document.querySelector(".login_btn")
const switch_to_register = document.querySelector(".switch_to_register")
const switch_to_login = document.querySelector(".switch_to_login")


reservation_btn.addEventListener("click", ()=>{
    location.href = "/booking"
})
// 顯示登入區塊
signin.addEventListener("click", ()=>{
    let nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = nowHeight + "px"
    grayscale_div.style.display = "block"
    login_background.style.display = "block"
})
login_background.addEventListener("click", ()=>{
    let nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = nowHeight + "px"
    grayscale_div.style.display = "block"
    login_background.style.display = "block"
})
// 關閉按鈕
close_btn.addEventListener("click", (e)=>{
    grayscale_div.style.display = "none"
    login_background.style.display = "none"
    e.stopPropagation()
})
// 切換註冊區塊
switch_to_register.addEventListener("click",()=>{
    document.querySelector(".login_area").style.display = "none"
    document.querySelector(".register_area").style.display = "block"
})
// 切換登入區塊
switch_to_login.addEventListener("click",()=>{
    document.querySelector(".login_area").style.display = "block"
    document.querySelector(".register_area").style.display = "none"
})

window.addEventListener("click",()=>{
    cat_list.style.display = "none"
},true)