export async function fetchData(){
    const res = await fetch('./js/data/data.json');
    const data = await res.json()
    return data
}