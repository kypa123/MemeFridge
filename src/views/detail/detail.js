import * as Api from '/api.js';


const desc = document.getElementById('detail-desc');
const img = document.getElementById('detail-img')


async function dataInsert(){
    try{
        const contentId = location.pathname.split('/')[2];
        const result = await Api.get(`/contents/${contentId}`);
        if (result){
            console.log(result)
            desc.innerText = result.title
            img.src = result.url;
        }
        else{
            desc.innerText = '없는 유저'
        }
    }
    catch(err){
        console.log(err)
    }
}

function addElements(){
    dataInsert();
}


addElements();