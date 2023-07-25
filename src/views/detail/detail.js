import * as Api from '/api.js';

const desc = document.getElementById('detail-desc');
const img = document.getElementById('detail-img');
const title = document.getElementById('detail-title');
const view = document.getElementById('content-view');

async function dataInsert() {
    try {
        const contentId = location.pathname.split('/')[2];
        const result = await Api.get('/contents/id', `?id=${contentId}`);
        console.log(result);
        if (result) {
            title.innerText = result.title || result.tag;
            img.src = result.url;
            const tags = result.tag.split(' ');
            tags.forEach(t => {
                const span = document.createElement('span');
                span.className = 'tag is-primary';
                span.innerText = t;
                desc.appendChild(span);
            });
            view.innerText = result.count;

            if (result.creator == 0) {
                deleteButton.remove();
            }

            const userInfo = await Api.get('/users', 'auth');
            if (userInfo.id == result.creator) {
                const container = document.getElementById('content-container');
                const div = document.createElement('div');
                const deleteButton = document.createElement('button');
                deleteButton.className = 'button is-primary';
                deleteButton.id = 'delete-button';
                deleteButton.innerText = '컨텐츠 삭제';

                deleteButton.addEventListener('click', async function (e) {
                    e.preventDefault();
                    const res = await Api.delete('/contents', '', {
                        id: contentId,
                    });
                    if (res) {
                        alert('삭제되었습니다');
                        window.location.href = '/main';
                    }
                });

                div.appendChild(deleteButton);
                container.appendChild(div);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

dataInsert();
