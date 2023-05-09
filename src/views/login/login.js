import * as Api from '../api.js';
import { validateEmail } from '../useful-functions.js'

const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const submitButton = document.getElementById('login-submit-button');


async function handleSubmit(e){
    e.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 4;

    if (!isPasswordValid) {
        return alert('비밀번호는 4글자 이상이어야 합니다.');
    }

    if (!isEmailValid) {
        return alert('이메일 형식이 맞지 않습니다.');
    }

    try{
        const data = { email, password };
        const result = await Api.post('/users/auth',data)
        console.log(result);
        if (result.status == 'success'){
            alert('로그인 ok')
            window.location.href='http://localhost:3000/main';
        }
        else{
            alert(result.message)
        }
    }
    catch(err){
        console.error(err.stack);
        alert(`오류가 발생하였습니다. 확인 후 다시 시도해주세요: ${err.message}`)
    }
}







submitButton.addEventListener('click', handleSubmit);