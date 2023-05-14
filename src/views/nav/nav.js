import * as Api from '../api.js';

const userNav = document.getElementById("auth")

async function navbarEndUserInfo(){
    const result = await Api.get('/auth')
    if(result.status == 404){
        userNav.innerHTML = `<a class="navbar-item" href="/sign-up">회원가입</a>
        <a class="navbar-item" href="/login">로그인</a>`
    }
    else{
        userNav.innerHTML = `<a class="navbar-item" href='/userPage</a>`
    }
}

navbarEndUserInfo();