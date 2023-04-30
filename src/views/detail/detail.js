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
            title.innerText = result.title || result.tag
            img.src = result.url;
            const tags = result.tag.split(" ")
            tags.forEach(t =>{
                const span = document.createElement('span')
                span.className = "tag is-primary";
                span.innerText = t;
                desc.appendChild(span);
            })
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