import * as Api from '../api.js'

const userName = document.getElementById('user-name')
const userEmail = document.getElementById('user-email')
const container =  document.getElementById('my-page-content')
const contentCount = document.getElementById('my-page-content-count')

async function loadMyPageContent(){
    const userInfo = await Api.get('/users','auth');
    if(userInfo.statusCode == 403){
        alert('로그인되어 있지 않습니다!');
        window.location.href="/main"
    }
    userName.innerText = userInfo.name + " 님";
    userEmail.innerText = userInfo.email;
    const result = await Api.get('/contents',`user?user=${userInfo.name}`);

    contentCount.innerText = `작성 개수: ${result.rowCount} 개`
    const resultContent = result.rows
    const row = document.createElement('div');
        row.className = "row"
        resultContent.forEach(el=>{
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
}



loadMyPageContent();