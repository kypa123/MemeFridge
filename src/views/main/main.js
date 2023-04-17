import * as Api from '../api.js';


const container = document.getElementById('all-contents');
const rankContainer = document.getElementById('rank-contents');

async function loadRankContent(){
    try{
        const result = await Api.get('/contents','/rank');
        console.log('main.js까지 무사히 도착완료.')
        const row = document.createElement('div')
        row.className = "row"
        result.forEach(el=>{
            row.innerHTML += `
        <div class="content">
            <a href="/detail/${el.id}">
                <figure>
                    <img class="content-img" src="${el.url}">
                    <p>${el.title}</p>
                </figure>    
            </a>
        </div>`
        });
        rankContainer.appendChild(row)
    }
    catch(err){
        console.log(err)
    }
}

async function loadMainContent(){
    try{
        let offset = 0
        while(true){
            const result = await Api.get('/contents',`?offset=${offset}`)
            const row = document.createElement('div')
            row.className = "row"
            result.rows.forEach(el=>{
                row.innerHTML += `
            <div class="content">
                <a href="/detail/${el.id}">
                    <figure>
                        <img class="content-img" src="${el.url}">
                        <p>${el.title}</p>
                    </figure>    
                </a>
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

loadRankContent()
loadMainContent()