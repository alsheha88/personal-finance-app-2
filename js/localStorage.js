import { fetchData } from "./data/fetch.js"

export async function getLocalStorage(){
    if (localStorage.getItem('data')){      
        return JSON.parse(localStorage.getItem('data'))   
    } else {
        const data = await fetchData();
        localStorage.setItem('data', JSON.stringify(data))
        return data    
    }
}
export function setLocalStorage(data){
    localStorage.setItem('data', JSON.stringify(data))
}