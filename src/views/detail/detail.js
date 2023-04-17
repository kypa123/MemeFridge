import * as Api from '/api.js';


const desc = document.getElementById('detail-desc');
const img = document.getElementById('detail-img')
const title = document.getElementById('detail-title');

async function dataInsert(){
    try{
        const contentId = location.pathname.split('/')[2];
        const result = await Api.get('/contents/id',`?id=${contentId}`);
        if (result){
            console.log(result)
            title.innerText = result.title
            desc.innerText = result.description
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