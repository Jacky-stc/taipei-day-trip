const homepage_url = "/api/attractions"
const category_url = "/api/categories"
const myDiv = document.getElementById("root")
const category_list = document.querySelector(".cat_list")
let nextpage = 1;
// 首次進入頁面自動讀取12筆資料進行呈現
fetch(homepage_url,{method:"get"})
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        for(let i =0;i<12;i++){
            document.getElementById("a"+i.toString()).href = "/attraction/" + data.data[i]['id']
            document.getElementById("img"+i.toString()).style.backgroundImage = "url(" + data.data[i]['images'][0] + ")"
            document.getElementById("name"+i.toString()).textContent = data.data[i]['name']
            document.getElementById("mrt"+i.toString()).textContent = data.data[i]['mrt']
            document.getElementById("cat"+i.toString()).textContent = data.data[i]['category']
        }
    })

// 製作景點類別列表
fetch(category_url,{method:"get"})
    .then((response)=>{
        return response.json()
    }).then((data)=>{
        for(let i=0;i<data.data.length;i++){
            const cat_list = document.createElement("div")
            cat_list.className = "categories"
            cat_list.setAttribute("id", "cat_list")
            cat_list.textContent = data.data[i]
            category_list.appendChild(cat_list)

        }
    })

// 滾動讀取頁面，設置監聽target為<footer>
const footer = document.querySelector(".copyright")
const observer = new IntersectionObserver(entries =>{
    entries.forEach(entry=>{
        // 元素離開監聽範圍不做反饋
        if(!entry.isIntersecting){
            return ;
        }
        // 當沒有下一頁資料就不再執行
        if(nextpage == null){
            return;
        }
        fetch((homepage_url+"?page="+ nextpage + "&keyword=" + search_content.value),{method:"get"})
        .then((response)=>{
            return response.json()
        }).then((data)=>{
            for(let i =0;i<data.data.length;i++){
                const newA = document.createElement("a")
                const newComponent = document.createElement("div")
                const newImage = document.createElement("div")
                const newName = document.createElement("div")
                const newScript = document.createElement("div")
                const newMrt = document.createElement("div")
                const newCat = document.createElement("div")
                newA.href = "/attraction/" + data.data[i]['id']
                newA.className = "a"
                newComponent.className = "components"
                newImage.className = "image"
                newName.className = "name"
                newScript.className = "script"
                newMrt.className = "mrt"
                newCat.className = "cat"
                newImage.style.backgroundImage = "url(" + data.data[i]['images'][0] +")"
                newName.textContent = data.data[i]['name']
                newMrt.textContent = data.data[i]['mrt']
                newCat.textContent = data.data[i]['category']
                newImage.appendChild(newName)
                newScript.appendChild(newMrt)
                newScript.appendChild(newCat)
                newComponent.appendChild(newImage)
                newComponent.appendChild(newScript)
                newA.appendChild(newComponent)
                myDiv.appendChild(newA)
        
                }
            
            nextpage = data.nextPage;
            })
    })
    
})
observer.observe(footer)
// 輸入關鍵字進行景點檢索
const search_content = document.querySelector(".search") 
const search_btn = document.querySelector(".search_btn")
search_btn.addEventListener("click", ()=>{
    if(!search_content.value){
        alert("請輸入查詢資料")
    }else{
        fetch(homepage_url+"?page=0" + "&keyword=" +  search_content.value, {method:"get"})
        .then((response)=>{
            return response.json();
        }).then((data)=>{
            if(data.data[0]==undefined){
                alert("查無資料，請重新輸入關鍵字")
            }else{  
                // 清除畫面
                const element = document.querySelectorAll(".a")
                for(i=0;i<element.length;i++){
                element[i].remove();
                }
                // 蓋上新搜尋結果
                for(i=0;i<data.data.length;i++){
                    const newA = document.createElement("a")
                    const newComponent = document.createElement("div")
                    const newImage = document.createElement("div")
                    const newName = document.createElement("div")
                    const newScript = document.createElement("div")
                    const newMrt = document.createElement("div")
                    const newCat = document.createElement("div")
                    newA.href = "/attraction/" + data.data[i]['id']
                    newA.className = "a"
                    newComponent.className = "components"
                    newImage.className = "image"
                    newName.className = "name"
                    newScript.className = "script"
                    newMrt.className = "mrt"
                    newCat.className = "cat"
                    newImage.style.backgroundImage = "url(" + data.data[i]['images'][0] +")"
                    newName.textContent = data.data[i]['name']
                    newMrt.textContent = data.data[i]['mrt']
                    newCat.textContent = data.data[i]['category']
                    newImage.appendChild(newName)
                    newScript.appendChild(newMrt)
                    newScript.appendChild(newCat)
                    newComponent.appendChild(newImage)
                    newComponent.appendChild(newScript)
                    newA.appendChild(newComponent)
                    myDiv.appendChild(newA)
                }
                nextpage = data.nextPage
                }
        })
    }
})
const input_bar = document.querySelector(".search")
const cat_list = document.querySelector(".cat_list")
input_bar.addEventListener(
    "click", function(event){
        cat_list.style.display = "grid";
        // 事件觸發後才有categories節點
        const categories = document.querySelectorAll(".categories")
        for(let i=0;i<categories.length;i++){
            categories[i].addEventListener("click", ()=>{
                input_bar.value = categories[i].textContent
            })
        };
    }
)
