import * as Api from '../api.js';


const container = document.getElementById('all-contents');
const rankContainer = document.getElementById('rank-contents');

async function loadRankContent(){
    try{
        const result = await Api.get('/contents','/rank');
        const row = document.createElement('div');
        row.className = "row"
        result.forEach(el=>{
            let tag = ''
            el.tag.split(" ").slice(0,3).forEach(t=>{
                tag += `<span class="tag is-primary" style="padding: 10px; font-weight:bold;">${t}</span>`
            })
            row.innerHTML += `
            <div class="content" style="position: relative">
                <a href="/detail/${el.id}">
                    <img class="content-img" src="${el.url}">
                </a>
                <div class="content-tags">
                    ${tag}
                </div>
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
                let tag = ''
                el.tag.split(" ").slice(0,3).forEach(t=>{
                    tag += `<span class="tag is-primary" style="padding: 10px; font-weight:bold;">${t}</span>`
                })
                row.innerHTML += `
                <div class="content" style="position: relative">
                    <a href="/detail/${el.id}">
                        <img class="content-img" src="${el.url}">
                    </a>
                    <div class="content-tags">
                        ${tag}
                    </div>
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