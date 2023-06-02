import * as Api from '../api.js';


async function navbarEndUserInfo(){
    const result = await Api.get('/users','auth')
    const userNav = document.getElementById("navbar-auth")
    
    if(result.statusCode == 403){
        const signUpTag = document.createElement('a');
        const loginTag = document.createElement('a');
        signUpTag.className = loginTag.className= "navbar-item";
        signUpTag.href = "/sign-up";
        loginTag.href = "/login";
        signUpTag.innerText = "회원가입";
        loginTag.innerText = "로그인";
        userNav.appendChild(signUpTag);
        userNav.appendChild(loginTag);
    }
    else{
        const userPageTag = document.createElement('a');
        const logoutTag = document.createElement('a');
        userPageTag.className = logoutTag.className = "navbar-item";
        userPageTag.href = "/userPage"
        userPageTag.innerHTML = `<span class="icon">
        <i class="fas fa-user-o"></i>
      </span>
      <span>
        마이페이지
      </span>`

        logoutTag.innerHTML = `<span class="icon">
        <i class="fas fa-user-o"></i>
      </span>
      <span>
        로그아웃
      </span>`
        
        userNav.appendChild(userPageTag);
        userNav.appendChild(logoutTag);
        logoutTag.addEventListener('click',async function(){
          const result = await Api.post('/users/logout');
          if(result.message == "ok"){
            window.location.href= '/main';
          }
        })
    }
}

async function searchExecute(e){
  e.preventDefault();
  try{
    const keywords = document.getElementById('search-input').value;
    const query = keywords.replaceAll(' ','-');
    console.log(query)
    window.location.href=`/search/tags/${query}`
  }
  catch(err){
    console.log(err)
  }
}

window.onload = function(){
  $('#nav-placeholder').load('/nav/nav.html', ()=>{
    const search = document.getElementById('search-container')
    search.addEventListener('submit',searchExecute)
    navbarEndUserInfo();
  });
}