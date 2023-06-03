import * as Api from '../api.js'


const myForm = document.getElementById('content-upload-form');


async function uploadContent(e){
    try{
        e.preventDefault();
        const form = new FormData(myForm);
        const result = await Api.post('/contents',form, 'meme')
        if(result){
          alert("업로드 완료!")
          window.location.href="/main"
        }
      }
      catch(err){
        console.log(err)
      }
}



async function checkLogin(){
    const userInfo = await Api.get('/users','auth');
    if(userInfo.statusCode == 403){
        const loginCheck = document.getElementById('login-check')
        loginCheck.innerText = '비회원 로그인';
    }
    else{
        const uploaderName = document.getElementById('uploader-name');
        const uploaderPassword = document.getElementById('uploader-password');
        uploaderName.placeholder = userInfo.name;
        uploaderName.readOnly = true;
        uploaderPassword.placeholder = "********";
        uploaderPassword.readOnly = true;
    }
}


checkLogin();

myForm.addEventListener('submit',uploadContent);