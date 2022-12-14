// 主畫面刻劃
export function imageLoad(data){
    const myDiv = document.getElementById("root")
    for(let i =0;i<data.data.length;i++){
        const newA = document.createElement("a")
        const newComponent = document.createElement("div")
        const newImage = document.createElement("div")
        const newName = document.createElement("div")
        const newScript = document.createElement("div")
        const newMrt = document.createElement("div")
        const newCat = document.createElement("div")
        newA.href = "/attraction/" + data.data[i].id
        newA.className = "a"
        newComponent.className = "components"
        newImage.className = "image"
        newName.className = "name"
        newScript.className = "script"
        newMrt.className = "mrt"
        newCat.className = "cat"
        newImage.style.backgroundImage = "url(" + data.data[i].images[0] +")"
        newName.textContent = data.data[i].name
        newMrt.textContent = data.data[i].mrt
        newCat.textContent = data.data[i].category
        newImage.appendChild(newName)
        newScript.appendChild(newMrt)
        newScript.appendChild(newCat)
        newComponent.appendChild(newImage)
        newComponent.appendChild(newScript)
        newA.appendChild(newComponent)
        myDiv.appendChild(newA)
        }
}
// 景點類別列表
export function category(data){
    const category_list = document.querySelector(".cat_list")
    for(let i=0;i<data.data.length;i++){
        const cat_list = document.createElement("div")
        cat_list.className = "categories"
        cat_list.setAttribute("id", "cat_list")
        cat_list.textContent = data.data[i]
        category_list.appendChild(cat_list)
    }
}
// 類別點擊輸入搜尋欄
export function catInput(categories){
    const input_bar = document.querySelector(".search")
    for(let i=0;i<categories.length;i++){
        categories[i].addEventListener("click", ()=>{
            input_bar.value = categories[i].textContent
        })
    };
}
// 清除畫面
export function cleanPage(){
    const element = document.querySelectorAll(".a")
    for(let i=0;i<element.length;i++){
        element[i].remove();
    }
}

// image preload
export function imgTest(data){
    let images = [];
    let imgLength = data.data.images.length;
    for(let i = 0;i<imgLength;i++){
        images[i] = new Image();
        images[i].src = data.data.images[i];
    }
}
export function imgPreload(data){
    const attractionImg = document.getElementById("img")
    const dotList = document.getElementById("dotList")
    const attractionName = document.getElementById("attraction_name")
    const attractionCatmrt = document.getElementById("catMrt")
    const attractionInfo = document.getElementById("info")
    const attractionAddress = document.getElementById("address")
    const attractionTrans = document.getElementById("transport")
    const title = document.querySelector("title")
    let imgLength = 0
    imgLength = data.data.images.length
    const images = [];
    images.onload = hideLoader()
    for(let i = 0; i<imgLength ; i++){
        images[i] = new Image();
        images[i].src = data.data.images[i];
    }
    for(let i=0;i<imgLength;i++){
        let newImg = document.createElement("div")
        newImg.className = "attractionImg"
        newImg.style.backgroundImage = "url(" + data.data.images[i] + ")"
        attractionImg.appendChild(newImg)  
    }
    for(let i=0;i<imgLength;i++){
        let newDot = document.createElement("span")
        newDot.className = "dot"
        dotList.appendChild(newDot)
    }
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


// 前一張圖片
export function viewedImg(imgNow){
    document.querySelectorAll(".attractionImg")[imgNow].style.display = "none"
    document.querySelectorAll(".dot")[imgNow].style.backgroundColor = "#fff"
}
// 當前圖片
export function recentImg(imgNow){
    document.querySelectorAll(".attractionImg")[imgNow].style.display = "block"
    document.querySelectorAll(".dot")[imgNow].style.backgroundColor = "#000"
}
// 選擇上半天行程
export function morningReservation(){
    document.getElementById("money").textContent = "新台幣2000元"
    document.querySelector(".morning_reservation").style.backgroundColor = "#448899"
    document.querySelector(".afternoon_reservation").style.backgroundColor = ""
}
// 選擇下半天行程
export function afternoonReservation(){
    document.getElementById("money").textContent = "新台幣2500元"    
    document.querySelector(".afternoon_reservation").style.backgroundColor = "#448899"
    document.querySelector(".morning_reservation").style.backgroundColor = ""
}
// 會員狀態檢查
export function userCheck(data){
    const signin = document.querySelector(".signin")
    if(data.data){
        signin.textContent = "登出系統"
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
    grayscale_div.style.height = nowHeight + "px"
    grayscale_div.style.display = "block"
    login_background.style.display = "block"
}
export function closeLoginArea(){
    const grayscale_div = document.querySelector(".grayscale")
    const login_background = document.querySelector(".login_background") 
    grayscale_div.style.display = "none"
    login_background.style.display = "none"
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
        for(let i =0;i<remove.length;i++){
            remove[i].remove()
        }
        const hr = document.querySelectorAll("main hr")
        for(let i =0;i<hr.length;i++){
            hr[i].remove()
        }
        const info = document.querySelector(".info")
        const newContent = document.createElement("div")
        newContent.className = "content"
        newContent.textContent = "目前沒有任何待預訂的行程"
        info.appendChild(newContent)
        const main = document.querySelector("main")
        main.style.minHeight = `0px`
        const footer = document.querySelector("footer")
        footer.style.height = `${document.body.scrollHeight-135}px`
        
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
    main.style.minHeight = nowHeight-253 +"px"
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