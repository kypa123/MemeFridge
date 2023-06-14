import * as Api from '../api.js';

const container = document.getElementById('all-contents');
const rankContainer = document.getElementById('rank-contents');
const offsetButton = document.getElementById('offset-button');


async function loadRankContent(){
    try{
        const result = await Api.get('/contents','/rank');
        const row = document.createElement('div');
        row.className = "row"
        result.forEach(el=>{
            let tag = ''
            el.tag.split(" ").slice(0,3).forEach(t=>{
                tag += `<span class="tag">${t}</span>`
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
        while(offset<3){
            const result = await Api.get('/contents',`?offset=${offset}`)
            const row = document.createElement('div')
            row.className = "row"
            result.rows.forEach(el=>{
                let tag = ''
                el.tag.split(" ").slice(0,3).forEach(t=>{
                    tag += `<span class="tag">${t}</span>`
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
            if (result.rowCount < 4) {
                offsetButton.innerText = '완료'
                localStorage.setItem('main-content-offset',-1)
            }    
            ++offset;
        }
        localStorage.setItem('main-content-offset',3)
    }
    catch(err){
        console.log(err);
    }
}

async function loadContentByOffset(e){
        e.preventDefault();
        const offset = parseInt(localStorage.getItem('main-content-offset'))
        const result = await Api.get('/contents',`?offset=${offset}`)
        const row = document.createElement('div')
        row.className = "row"
        result.rows.forEach(el=>{
            let tag = ''
            el.tag.split(" ").slice(0,3).forEach(t=>{
                tag += `<span class="tag">${t}</span>`
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
        if (result.rowCount < 4){
            offsetButton.innerText = '완료';
            localStorage.setItem('main-content-offset',-1)
            offsetButton.removeEventListener('click',loadContentByOffset);
        }
        else{
            localStorage.setItem('main-content-offset', offset + 1);
        }
}


loadRankContent()
loadMainContent()

offsetButton.addEventListener('click',loadContentByOffset);