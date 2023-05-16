import * as Api from '../api.js';

const userNav = document.getElementById("navbar-auth")

async function navbarEndUserInfo(){
    console.log('내비게이션 바')
    const result = await Api.get('/users','auth')
    
    console.log(result);
    
    if(result.statusCode == 403){
        const signUpTag = document.createElement('a');
        const loginTag = document.createElement('a');
        signUpTag.className = loginTag.className= "navbar-item";
        signUpTag.href = "/sign-up";
        loginTag.href = "/login";
        signUpTag.innerText = "회원가입";
        loginTag.innerText = "로그인";
        userNav.appendChild(signUpTag)
        userNav.appendChild(loginTag)
    }
    else{
        const userPageTag = document.createElement('a');
        const logoutTag = document.createElement('a');
        userPageTag.className = "navbar-item";
        userPageTag.href = "/userPage"
        userPageTag.innerHTML = `<span class="icon">
        <i class="fas fa-user-o"></i>
      </span>
      <span>
        마이페이지
      </span>`
        logoutTag.className = "navbar-item";
        logoutTag.href = "/users/auth";
        logoutTag.innerHTML = `<span class="icon">
        <i class="fas fa-user-o"></i>
      </span>
      <span>
        로그아웃
      </span>`
        userNav.appendChild(userPageTag)
    }
}

navbarEndUserInfo();