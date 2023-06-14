import * as Api from '../api.js';


async function loadTitle(){
    const titleBox = document.getElementById('all-content-title-box');
    const tags = decodeURI(location.pathname.split('/')[3])
    titleBox.innerText = `${tags} 검색결과`
}

async function searchDataInsert(){
    const container = document.getElementById('all-contents');
    const tags = location.pathname.split('/')[3]
    const result = await Api.get('/contents/tags',`?tags=${tags}`)
    if(result.rowCount == 0){
        const div = document.createElement('div');
        const noResult = document.createElement('h1');
        const pepeImage = document.createElement('img')
        pepeImage.src = '/images/pepe.jpg';
        pepeImage.style="width: 230px; height: 230px;"
        noResult.innerText = '검색 결과가 없습니다';
        div.style= "text-align: center;";
        div.appendChild(noResult);
        div.appendChild(pepeImage);
        container.appendChild(div);
        return
    }

    let rowCount = 0 
    while(rowCount <= result.rowCount){
        const row = document.createElement('div')
        row.className = "row"
        const singleRow = result.rows.slice(rowCount, rowCount+4)
        singleRow.forEach(el=>{
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
    container.appendChild(row)
    rowCount = rowCount + 4
    }

}


loadTitle();
searchDataInsert();
