import * as Api from '../api.js';

const container = document.getElementById('content-container');
let offset = 0

async function loadMainContent(){
    try{
        while(true){
            const result = await Api.get('/contents',`?offset=${offset}`)
            const row = document.createElement('div')
            row.className = "row"
            result.rows.forEach(el=>{
                console.log(el)
                row.innerHTML += `
            <div class="content">
                <figure class="image is-128x128">
                    <img class="content-img" src="${el.url}">
                </figure>
                    <p>${el.title}</p>
            </div>`
            });
            container.appendChild(row);
            ++offset
            if (result.rowCount < 4) break
        }
    }
    catch(err){

    }
}


loadMainContent()