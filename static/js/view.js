export class CreateElement{
    constructor(tag, className="", textContent = ""){
        this.e = document.createElement(tag)
        this.e.className = className
        this.e.textContent = textContent
    }
}
// 主畫面刻劃
export function imageLoad(data){
    const myDiv = document.getElementById("root")
    data.data.forEach((value)=>{
        const newA = new CreateElement("a", "a").e
        const newComponent = new CreateElement("div", "components").e
        const newImage = new CreateElement("div", "image").e
        const newName = new CreateElement("div", "name", value.name).e
        const newScript = new CreateElement("div", "script").e
        const newMrt = new CreateElement("div", "mrt", value.mrt).e
        const newCat = new CreateElement("div", "cat", value.category).e
        newA.href = `/attraction/${value.id}`
        newImage.style.backgroundImage = `url(${value.images[0]})`
        newImage.appendChild(newName)
        newScript.appendChild(newMrt)
        newScript.appendChild(newCat)
        newComponent.appendChild(newImage)
        newComponent.appendChild(newScript)
        newA.appendChild(newComponent)
        myDiv.appendChild(newA)
    })
}
// 景點類別列表
export function category(data){
    const categoryList = document.querySelector(".cat_list")
    data.data.forEach((category)=>{
        const catList = new CreateElement("div", "categories", category).e
        catList.setAttribute("id", "cat_list")
        categoryList.appendChild(catList)
    })
}
// 類別點擊輸入搜尋欄
export function catInput(categories){
    const inputBar = document.querySelector(".search")
    categories.forEach((category)=>{
        category.addEventListener("click", ()=>{
            inputBar.value = category.textContent
        })
    })
}
// 清除畫面
export function cleanPage(){
    const elements = document.querySelectorAll(".a")
    elements.forEach((element)=>{
        element.remove();
    })
}

// image preload
export function imgPreload(data){
    const attractionImg = document.getElementById("img")
    const inner = document.querySelector(".inner")
    const dotList = document.getElementById("dotList")
    const attractionName = document.getElementById("attraction_name")
    const attractionCatmrt = document.getElementById("catMrt")
    const attractionInfo = document.getElementById("info")
    const attractionAddress = document.getElementById("address")
    const attractionTrans = document.getElementById("transport")
    const title = document.querySelector("title")
    data.data.images.forEach((image)=>{
        const img = new CreateElement("img").e
        img.src = image
        inner.appendChild(img)
        const newDot = new CreateElement("span", "dot").e
        dotList.appendChild(newDot)
    })
    title.textContent = data.data.name
    attractionName.textContent = data.data.name
    attractionCatmrt.textContent = data.data.category+"at"+data.data.mrt
    attractionInfo.textContent = data.data.description
    attractionAddress.textContent = data.data.address
    attractionTrans.textContent = data.data.transport
}
// 等待圖示
export function showLoader(){
    const loader = document.querySelector(".loader")
    loader.classList.add("show")
}
export function hideLoader(){
    const loader = document.querySelector(".loader")
    loader.classList.remove("show")
    document.querySelector(".preload").style.display = "none"
}
// reservation
export function morningReservation(){
    document.getElementById("money").textContent = "新台幣2000元"
    document.querySelector(".morning_reservation").style.backgroundColor = "#448899"
    document.querySelector(".afternoon_reservation").style.backgroundColor = ""
}
export function afternoonReservation(){
    document.getElementById("money").textContent = "新台幣2500元"    
    document.querySelector(".afternoon_reservation").style.backgroundColor = "#448899"
    document.querySelector(".morning_reservation").style.backgroundColor = ""
}
// user status check
export function userCheck(data){
    const signin = document.querySelector(".signin")
    const iconContainer = document.querySelector(".icon-container")
    if(data.data){
        signin.textContent = "登出系統"
        iconContainer.style.display = "flex"
    }else{
        signin.textContent = "登入/註冊"
    }
}
export function userLoginPop(data){
    if(data.data){
        location.href = "/booking"
    }else{
        showLoginArea()
    }
}
// 前端輸入驗證
export function nameCheck(){
    const register_name = document.querySelector("#register_name")
    if(register_name.validity.valueMissing){
        register_name.setCustomValidity("姓名欄位不能為空白")
    }else{
        register_name.setCustomValidity("")
    }
    register_name.reportValidity()
}
export function emailCheck(){
    const register_email = document.querySelector("#register_email")
    if(register_email.validity.patternMismatch){
        register_email.setCustomValidity("不合法的email格式")
    }else{
        register_email.setCustomValidity("")
    }
    register_email.reportValidity()
}
export function passwordCheck(){
    const register_password = document.querySelector("#register_password")
    if(register_password.validity.patternMismatch){
        register_password.setCustomValidity("需為英文或數字組合8位以上密碼")
    }else{
        register_password.setCustomValidity("")
    }
    register_password.reportValidity()
}
// 登入註冊提示
export function registerHint(data){
    const hint_container = document.querySelector(".hint_container")
    const hint = document.querySelector(".hint")
    if(data["ok"]){
        hint.textContent = "註冊成功"
        hint_container.style.display = "block"
        setTimeout(()=>{hint_container.style.display= "none"}, 2000)
    }else{
        hint.textContent = "註冊失敗"
        hint_container.style.display = "block"
        setTimeout(()=>{hint_container.style.display= "none"}, 2000)
    }
}
export function loginHint(data){
    const hint_container = document.querySelector(".hint_container")
    const hint = document.querySelector(".hint")
    if(data["ok"]){
        location.reload()
    }else{
        hint.textContent = "登入失敗"
        hint_container.style.display = "block"
        setTimeout(()=>{hint_container.style.display= "none"}, 2000)
    }
}
export function hintPop(message){
    const hintContainer = document.querySelector(".hint_container")
    const hint = document.querySelector(".hint")
    hint.textContent = message
    hintContainer.display = "block"
    setTimeout(()=>{hintContainer.style.display= "none"}, 2000)
}
// 顯示、關閉登入區塊
export function showLoginArea(){
    const grayscale_div = document.querySelector(".grayscale")
    const login_background = document.querySelector(".login_background") 
    const nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = `${nowHeight}px`
    grayscale_div.style.display = "block"
    login_background.classList.add("show")
}
export function closeLoginArea(){
    const grayscale_div = document.querySelector(".grayscale")
    const login_background = document.querySelector(".login_background") 
    grayscale_div.style.display = "none"
    login_background.classList.remove("show")
}
// 切換畫面
export function switchToRegister(){
    document.querySelector(".login_area").style.display = "none"
    document.querySelector(".register_area").style.display = "block"
}
export function switchToLogin(){
    document.querySelector(".login_area").style.display = "block"
    document.querySelector(".register_area").style.display = "none"
}
// footer置底
export function updateFooterPosition(){
    const pageHeight = document.body.scrollHeight;
    document.querySelector("footer").style.top = pageHeight + "px";
}
// 重整
export function reload(data){
    if(data.ok){
        location.reload()
    }
}
// booking畫面
export function bookingUser(fetchResponse){
    if(fetchResponse.data === null){
        location.href = "/"
    }else{
        const userName = document.querySelector(".title")
        userName.textContent = `您好，${fetchResponse.data.name}，待預訂的行程如下：`
    }
}
export function bookingPage(data){
    const result = data.data
    if(result === null){
        const remove = document.querySelectorAll(".remove")
        remove.forEach((element)=>{
            element.remove()
        })
        const hr = document.querySelectorAll("main hr")
        hr.forEach((element)=>{
            element.remove()
        })
        const info = document.querySelector(".info")
        const newContent = new CreateElement("div", "content margin", "目前沒有任何待預定的行程").e
        info.appendChild(newContent)
        const main = document.querySelector("main")
        main.style.minHeight = `0px`
        const footer = document.querySelector("footer")
        footer.style.height = `${document.body.scrollHeight-230}px`    
    }else{
        const attractionImg = document.querySelector(".attraction_img")
        const attarctionTitle = document.querySelector(".attraction_title")
        const date = document.querySelector(".date")
        const time = document.querySelector(".time")
        const price = document.querySelector(".price")
        const address = document.querySelector(".address")
        attractionImg.src = result.attraction.image
        attarctionTitle.textContent = `台北一日遊： ${result.attraction.name}`
        date.textContent = result.date
        if(result.time === "上半天"){
            time.textContent = `早上9點到下午2點`
        }
        if(result.time === "下半天"){
            time.textContent = `下午2點到晚上7點`
        }
        price.textContent = `新台幣 ${result.price}元`
        address.textContent = result.attraction.address
    }
}
export function deleteMessage(data){
    if(data.ok === true){
        location.reload()
    }
}
export function mainResize(){
    const main = document.querySelector("main")
    const nowHeight = document.body.scrollHeight
    main.style.minHeight = nowHeight-258 +"px"
}
export function shoppingCart(data){
    if(data.data === null){
        return
    }
    if(data.data && data.data.attraction){
        const orderNum = document.querySelector(".order-num")
        orderNum.textContent = `共1個預訂行程`
        document.querySelector(".profile-cart").style.display = "none"
        document.querySelector(".text").style.display = "none"
        const orderAttractions = document.querySelector(".ordered-attractions")
        const orderedImg = document.querySelector(".ordered-img")
        const orderedName = document.querySelector(".ordered-name")
        const orderedDate = document.querySelector(".ordered-date")
        const orderedTime = document.querySelector(".ordered-time")
        orderAttractions.style.display = "flex"
        orderedImg.src = data.data.attraction.image
        orderedName.textContent = `台北一日遊：${data.data.attraction.name}`
        orderedDate.textContent = `日期：${data.data.date}`
        orderedTime.textContent = `時間：${data.data.time}`
        const orderHint = document.querySelector(".order-hint")
        orderHint.style.display = "block"
        orderHint.textContent = "1"
    }
}
export function getOrderList(data){
    Object.values(data).forEach((element)=>{
        const container = new CreateElement("div", "container").e
        const image = new CreateElement("div", "image").e
        const info = new CreateElement("div", "info").e
        const title = new CreateElement("div", "content title", element.attractionName).e
        const date = new CreateElement("div", "content date", element.date).e
        const time = new CreateElement("div", "content time", element.time).e
        const number = new CreateElement("div", "content number", `訂單編號：${element.number}`).e
        image.style.backgroundImage = `url(${element.image})`
        info.append(title, date, time, number)
        container.append(image, info)
        document.querySelector("main").appendChild(container)
    })
}
export function showGrayscale(){
    const grayscale_div = document.querySelector(".grayscale")
    const nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = `${nowHeight}px`
    grayscale_div.style.display = "block"
}
export function showHint(text){
    const hintContainer = document.querySelector(".hint_container")
    const hint = document.querySelector(".hint")
    hintContainer.style.display = "block"
    hint.textContent = text
    setTimeout(()=>{
        hintContainer.style.display = "none"
    }, 3000)
}