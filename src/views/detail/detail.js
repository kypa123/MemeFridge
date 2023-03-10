import * as Api from '../api.js';


const desc = document.getElementById('detail-desc');
const img = document.getElementById('detail-img')
console.log(desc.textContent)


async function dataInsert(){
    try{
        const result = await Api.get('/contents','')
        if (result.status == 'success'){
            console.log(result)
            desc.innerText = result.res[0].name
        }
        else{
            desc.innerText = '없는 유저'
        }
    }
    catch(err){
        console.log(err)
    }
}
dataInsert()