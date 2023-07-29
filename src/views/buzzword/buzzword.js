import * as Api from '../api.js';

const buzzwordContainer = document.getElementById('buzzword-container');
const offsetButton = document.getElementById('offset-button');

async function loadBuzzword() {
    try {
        let offset = 0;
        while (offset < 5) {
            const result = await Api.get('/buzzwords', `?offset=${offset}`);
            result.rows.forEach(el => {
                const wrapper = document.createElement('div');
                const name = document.createElement('div');
                const tags = document.createElement('div');
                const description = document.createElement('div');
                const hr = document.createElement('hr');
                wrapper.className = 'buzzword-wrapper';
                wrapper.id = el.id;
                name.className = 'buzzword buzzword_name';
                name.innerText = el.name;
                tags.className = 'buzzword buzzword_tags';
                tags.innerText = el.tags
                    .split(' ')
                    .map(el => el.replace('#', ''))
                    .join(', ');
                description.className = 'buzzword buzzword_desc';
                description.innerText = el.description;
                wrapper.appendChild(name);
                wrapper.appendChild(description);

                if (el.creator == 2) {
                    const creator = document.createElement('div');
                    creator.className = 'buzzword buzzword_creator';
                    creator.innerText = '*chatGPT';
                    wrapper.appendChild(creator);
                }

                wrapper.appendChild(tags);
                buzzwordContainer.appendChild(wrapper);
                buzzwordContainer.appendChild(hr);
                ++offset;
            });
            localStorage.setItem('buzzword-offset', 5);
        }
    } catch (err) {
        console.log(err);
    }
}

async function loadBuzzwordByOffset(e) {
    e.preventDefault();
    const offset = parseInt(localStorage.getItem('buzzword-offset'));
    const result = await Api.get('/buzzwords', `?offset=${offset}`);

    result.rows.forEach(el => {
        const wrapper = document.createElement('div');
        const name = document.createElement('div');
        const tags = document.createElement('div');
        const description = document.createElement('div');
        const hr = document.createElement('hr');
        wrapper.className = 'buzzword-wrapper';
        wrapper.id = el.id;
        name.className = 'buzzword buzzword_name';
        name.innerText = el.name;
        tags.className = 'buzzword buzzword_tags';
        tags.innerText = el.tags
            .split(' ')
            .map(el => el.replace('#', ''))
            .join(', ');
        description.className = 'buzzword buzzword_desc';
        description.innerText = el.description;
        wrapper.appendChild(name);
        wrapper.appendChild(description);

        if (el.creator == 2) {
            const creator = document.createElement('div');
            creator.className = 'buzzword buzzword_creator';
            creator.innerText = '*chatGPT';
            wrapper.appendChild(creator);
        }

        wrapper.appendChild(tags);
        buzzwordContainer.appendChild(wrapper);
        buzzwordContainer.appendChild(hr);
    });
    if (result.rowCount < 4) {
        offsetButton.innerText = '완료';
        localStorage.setItem('buzzword-offset', -1);
        offsetButton.removeEventListener('click', loadContentByOffset);
    } else {
        localStorage.setItem('buzzword-offset', offset + 1);
    }
}

loadBuzzword();
offsetButton.addEventListener('click', loadBuzzwordByOffset);
