import * as view from "./view.js"
import * as model from "./model.js"

const homepage_url = "/api/attractions"
const category_url = "/api/categories"
let nextpage = 1;

// 首次進入頁面自動讀取12筆資料進行呈現
model.fetchUrl(homepage_url,"get",view.imageLoad)

// 製作景點類別列表
model.fetchUrl(category_url,"get",view.category)


// 滾動讀取頁面，設置監聽target為<footer>
const footer = document.querySelector(".copyright")
const search_content = document.querySelector(".search") 
const observer = new IntersectionObserver(entries =>{
    entries.forEach(entry=>{
        // 元素離開監聽範圍不做反饋
        if(!entry.isIntersecting){
            return ;
        }
        // 當沒有下一頁資料就不再執行
        if(!nextpage){
            return;
        }
        async function scrollFetch(){
            const fetchData = await fetch(homepage_url+"?page="+ nextpage + "&keyword=" + search_content.value)
            const fetchResponse = await fetchData.json()
            view.imageLoad(fetchResponse)
            nextpage = fetchResponse.nextPage
        }
        scrollFetch()
    })
})    
observer.observe(footer)

// 輸入關鍵字進行景點檢索
const search_btn = document.querySelector(".search_btn")
search_btn.addEventListener("click", ()=>{
    if(!search_content.value){
        alert("請輸入查詢資料")
    }else{
        async function searchFetch(){
            const fetchData = await fetch(homepage_url+"?page=0" + "&keyword=" +  search_content.value)
            const fetchResponse = await fetchData.json()
            if(!fetchResponse.data[0]){
                alert("查無資料，請重新輸入關鍵字")
            }else{  
                view.cleanPage()
                view.imageLoad(fetchResponse)
                nextpage = fetchResponse.nextPage;
            }
        }
        searchFetch()
    }
})
const input_bar = document.querySelector(".search")
const cat_list = document.querySelector(".cat_list")
input_bar.addEventListener(
    "click", ()=>{
        cat_list.style.display = "grid";
        const categories = document.querySelectorAll(".categories")
        view.catInput(categories)
    }
)

window.addEventListener("click",()=>{
    cat_list.style.display = "none"
},true)