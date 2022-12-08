// Fetch
export async function fetchUrl(url,method,callback){
    let fetchData = await fetch(url,{method:method})
    let fetchResponse = await fetchData.json()
    callback(fetchResponse)
    if(fetchResponse.data){
        if(fetchResponse.data.images){
            let imgLength = fetchResponse.data.images.length
            return imgLength
        }
    }
}
// 註冊資料
export const register_info = {
    "name":register_form.name.value.toString(),
    "email":register_form.email.value.toString(),
    "password":register_form.password.value.toString()
}
// 登入資料
export const login_info = {
    "email": login_form.email.value.toString(),
    "password":login_form.password.value.toString()
}
