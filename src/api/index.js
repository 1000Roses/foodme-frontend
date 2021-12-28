const queryString = require('query-string');

async function chatNormal(question){
    const host = process.env.VUE_APP_HOST
    const api = process.env.VUE_APP_NORMAL_CHAT_API
    var url = host + api + "?question="+ question
    console.log(url)
    var res = await fetch(url, {
        method: "GET"
    })
    if (res.ok && res.status === 200){
        res = await res.json()
        return res
    }else{
        return "!!! something went wrong"
    }
}

async function suggestFood(){
    const host = process.env.VUE_APP_HOST
    const api = process.env.VUE_APP_SUGGEST_FOOD_API

    var infor = JSON.parse(localStorage.getItem("infor"))
    var url = host + api + "?" + queryString.stringify(infor)
    console.log("in suggest food : ", url)
    var res = await fetch(url + "?" + queryString.stringify(infor), {
        method : "GET"
    })

    if (res.ok && res.status === 200){
        res = await res.json()
        return res
    }else{
        return "!!! something went wrong"
    }
}

export { chatNormal, suggestFood }