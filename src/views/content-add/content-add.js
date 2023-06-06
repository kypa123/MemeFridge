import * as Api from '../api.js'


const myForm = document.getElementById('content-upload-form');
const uploaderName = document.getElementById('uploader-name');
const uploaderPassword = document.getElementById('uploader-password');


async function uploadContent(e){
    e.preventDefault();
    const form = new FormData(myForm);
    if(!check){
      for(const pair of form.entries()){
        console.log(pair[0], pair[1])
        if(pair[0] == 'src'){
          if(pair[1].size == 0){
            return alert('파일을 올려주세요!');
          }
        }

        else if(pair[0] == 'uploaderName' || pair[0] == 'uploaderPassword'){
          if(pair[1].toString().length < 4 || pair[1].toString().length > 10){
            return alert('아이디, 비밀번호의 길이를 4~10자로 해주세요!');
          }
        }
        else if(!pair[1]){
          return alert(`${pair[0]}을(를) 다시한번 확인해주세요!`);
        }
      }
    }
    try{
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
        return false
    }
    else{
        uploaderName.placeholder = userInfo.name;
        uploaderName.readOnly = true;
        uploaderName.value = userInfo.name;
        uploaderPassword.placeholder = "********";
        uploaderPassword.readOnly = true;
        return true
    }
}


const check = await checkLogin();

myForm.addEventListener('submit',uploadContent);