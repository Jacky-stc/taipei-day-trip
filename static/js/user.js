function register_btn(){
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
        console.log(data)
        if(data["ok"]){
            alert("註冊成功!")
            location.href = "/"
        }else{
            alert("註冊失敗，請重新註冊。")
        }
    })
}
function login_btn(){
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
        console.log(data)
        console.log(document.cookie)
        if(data["ok"]){
            location.href = "/"
        }else{
            alert("帳號密碼錯誤，請重新輸入")
        }
    })
}


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
signin.addEventListener("click", ()=>{
    const nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = nowHeight + "px"
    grayscale_div.style.display = "block"
    login_background.style.display = "block"
})
login_background.addEventListener("click", ()=>{
    const nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = nowHeight + "px"
    grayscale_div.style.display = "block"
    login_background.style.display = "block"
})
close_btn.addEventListener("click", (e)=>{
    grayscale_div.style.display = "none"
    login_background.style.display = "none"
    e.stopPropagation()
})
switch_to_register.addEventListener("click",()=>{
    document.querySelector(".login_area").style.display = "none"
    document.querySelector(".register_area").style.display = "block"
})
switch_to_login.addEventListener("click",()=>{
    document.querySelector(".login_area").style.display = "block"
    document.querySelector(".register_area").style.display = "none"
})

window.addEventListener("click",()=>{
    cat_list.style.display = "none"
},true)