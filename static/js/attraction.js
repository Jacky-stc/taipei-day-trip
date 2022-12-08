// 設定API URL
let attraction_id = window.location.pathname.replace("/attraction/","")
let attractionIdUrl = "/api/attraction/" + attraction_id

// 等待圖示
const loader = document.querySelector(".loader")
function showLoader(){
    loader.classList.add("show")
}
function hideLoader(){
    loader.classList.remove("show")
}
// 頁面載入
showLoader()
async function initImage(){
    let fetch_img = await fetch(attractionIdUrl, {method:"get"})
    let fetch_response = await fetch_img.json()
    console.log(fetch_response)
    img_preload(fetch_response)
}
initImage()
// 結束檔案載入
window.addEventListener("load", ()=>{
    hideLoader()
    document.querySelector(".preload").style.display = "none"
})

// image preload
const attractionImg = document.getElementById("img")
const dotList = document.getElementById("dotList")
const attractionName = document.getElementById("attraction_name")
const attractionCatmrt = document.getElementById("catMrt")
const attractionInfo = document.getElementById("info")
const attractionAddress = document.getElementById("address")
const attractionTrans = document.getElementById("transport")
const title = document.querySelector("title")
function img_preload(data){
    imgLength = data.data.images.length
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

let imgNow = 0
let imgLength = 0
let dot = document.querySelectorAll(".dot")
let allImg = document.querySelectorAll(".attractionImg")
// 下一張圖片
document.querySelector(".next").addEventListener("click", ()=>{
    allImg[imgNow].style.display = "none"
    dot[imgNow].style.backgroundColor = "#fff"
    imgNow ++
    if(imgNow > imgLength-1){
        imgNow = 0
    }
    allImg[imgNow].style.display = "block"
    dot[imgNow].style.backgroundColor = "#000"
})
// 上一張圖片
document.querySelector(".prev").addEventListener("click", ()=>{
    allImg[imgNow].style.display = "none"
    dot[imgNow].style.backgroundColor = "#fff"
    imgNow --
    if(imgNow < 0){
        imgNow = imgLength-1
    }
    allImg[imgNow].style.display = "block"
    dot[imgNow].style.backgroundColor = "black"
})

document.querySelector(".morning_reservation").style.backgroundColor = "#448899"
// 選擇上半天行程
document.querySelector(".morning_reservation").addEventListener("click",()=>{
    document.getElementById("money").textContent = "新台幣2000元"
    document.querySelector(".morning_reservation").style.backgroundColor = "#448899"
    document.querySelector(".afternoon_reservation").style.backgroundColor = ""
})
// 選擇下半天行程
document.querySelector(".afternoon_reservation").addEventListener("click",()=>{
    document.getElementById("money").textContent = "新台幣2500元"    
    document.querySelector(".afternoon_reservation").style.backgroundColor = "#448899"
    document.querySelector(".morning_reservation").style.backgroundColor = ""
})
