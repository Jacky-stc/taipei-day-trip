let attraction_id = window.location.pathname.replace("/attraction/","")
const attractionIdUrl = "/api/attraction/" + attraction_id
const attractionImg = document.getElementById("img")
const dotList = document.getElementById("dotList")
const attractionName = document.getElementById("attraction_name")
const attractionCatmrt = document.getElementById("catMrt")
const attractionInfo = document.getElementById("info")
const attractionAddress = document.getElementById("address")
const attractionTrans = document.getElementById("transport")
let imgNow = 0
let imgLength = 0
fetch(attractionIdUrl, {method:"get"})
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        imgLength = data.data['images'].length
        for(i=0;i<imgLength;i++){
            let newImg = document.createElement("div")
            newImg.className = "attractionImg"
            newImg.style.backgroundImage = "url(" + data.data['images'][i] + ")"
            attractionImg.appendChild(newImg)  
        }
        for(i=0;i<imgLength;i++){
            let newDot = document.createElement("span")
            newDot.className = "dot"
            dotList.appendChild(newDot)
        }
        attractionName.textContent = data.data["name"]
        attractionCatmrt.textContent = data.data["category"]+"at"+data.data["mrt"]
        attractionInfo.textContent = data.data["description"]
        attractionAddress.textContent = data.data["address"]
        attractionTrans.textContent = data.data["transport"]
        document.querySelectorAll(".attractionImg")[0].style.display = "block"
        document.querySelectorAll(".dot")[0].style.backgroundColor = "black"
        document.querySelectorAll(".dot")[0].style.boxSizing = "border-box"
        document.querySelectorAll(".dot")[0].style.border = "1px solid #fff"
    })


function nextImg(){
    document.querySelectorAll(".attractionImg")[imgNow].style.display = "none"
    document.querySelectorAll(".dot")[imgNow].style.backgroundColor = "#fff"
    document.querySelectorAll(".dot")[imgNow].style.boxSizing = ""
    document.querySelectorAll(".dot")[imgNow].style.border = "none"
    imgNow ++
    if(imgNow > imgLength-1){
        imgNow = 0
    }
    document.querySelectorAll(".attractionImg")[imgNow].style.display = "block"
    document.querySelectorAll(".dot")[imgNow].style.backgroundColor = "black"
    document.querySelectorAll(".dot")[imgNow].style.boxSizing = "border-box"
    document.querySelectorAll(".dot")[imgNow].style.border = "1px solid #fff"
}
function prevImg(){
    document.querySelectorAll(".attractionImg")[imgNow].style.display = "none"
    document.querySelectorAll(".dot")[imgNow].style.backgroundColor = "#fff"
    document.querySelectorAll(".dot")[imgNow].style.boxSizing = ""
    document.querySelectorAll(".dot")[imgNow].style.border = "none"
    imgNow --
    if(imgNow < 0){
        imgNow = imgLength-1
    }
    document.querySelectorAll(".attractionImg")[imgNow].style.display = "block"
    document.querySelectorAll(".dot")[imgNow].style.backgroundColor = "black"
    document.querySelectorAll(".dot")[imgNow].style.boxSizing = "border-box"
    document.querySelectorAll(".dot")[imgNow].style.border = "1px solid #fff"
}   
document.querySelector(".morning_reservation").style.backgroundColor = "#448899"
function morning_reservation(){
    document.getElementById("money").textContent = "新台幣2000元"
    document.querySelector(".morning_reservation").style.backgroundColor = "#448899"
    document.querySelector(".afternoon_reservation").style.backgroundColor = ""
}
function afternoon_reservation(){
    document.getElementById("money").textContent = "新台幣2500元"    
    document.querySelector(".afternoon_reservation").style.backgroundColor = "#448899"
    document.querySelector(".morning_reservation").style.backgroundColor = ""
}
const grayscale_div = document.querySelector(".grayscale")
function grayscale(){
    const nowHeight = document.querySelector("body").scrollHeight
    grayscale_div.style.height = nowHeight + "px"
    grayscale_div.style.display = "block"
}
window.addEventListener("click",(e)=>{
    grayscale_div.style.display = "none"
},true)