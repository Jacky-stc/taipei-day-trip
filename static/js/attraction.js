import * as view from "./view.js"
import * as model from "./model.js"

let imgNow = 0;
let imgLength = 0;

// 設定API URL
let attraction_id = window.location.pathname.replace("/attraction/","");
let attractionIdUrl = "/api/attraction/" + attraction_id;

// 頁面載入
view.showLoader()
model.fetchUrl(attractionIdUrl,"get",view.imgPreload)
.then(data=>{
    imgLength = data
})
// 結束檔案載入
window.addEventListener("load", ()=>{
    view.hideLoader();
})

// 下一張圖片
document.querySelector(".next").addEventListener("click", ()=>{
    view.viewedImg(imgNow)
    imgNow ++
    if(imgNow > imgLength-1){
        imgNow = 0
    }
    view.recentImg(imgNow)
})
// 上一張圖片
document.querySelector(".prev").addEventListener("click", ()=>{
    view.viewedImg(imgNow)
    imgNow --
    if(imgNow < 0){
        imgNow = imgLength-1
    }
    view.recentImg(imgNow)
})

// 選擇上半天行程
document.querySelector(".morning_reservation").addEventListener("click",()=>{
    view.morningReservation()
})
// 選擇下半天行程
document.querySelector(".afternoon_reservation").addEventListener("click",()=>{
    view.afternoonReservation()
})
