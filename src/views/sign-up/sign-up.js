import * as Api from '../api.js';
import { validateEmail } from '../useful-functions.js';

const idInput = document.getElementById('id-input');
const emailInput = document.getElementById('email-input');
const passwordInput = document.getElementById('password-input');
const submitButton = document.getElementById('sign-up-submit-button');

async function handleSubmit(e) {
    e.preventDefault();

    const name = idInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const isNameValid = name.length >= 2;
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 4;

    if (!isNameValid || !isPasswordValid) {
        return alert(
            '아이디는 2글자 이상, 비밀번호는 4글자 이상이어야 합니다.',
        );
    }

    if (!isEmailValid) {
        return alert('이메일 형식이 맞지 않습니다.');
    }

    try {
        const data = { name, email, password };
        const result = await Api.post('/users', data);
        if (result.message) {
            alert(result.message);
        } else {
            alert('회원가입 완료!');
            window.location.href = '/main';
        }
    } catch (err) {
        console.error(err.stack);
        alert(
            `오류가 발생하였습니다. 확인 후 다시 시도해주세요: ${err.message}`,
        );
    }
}

submitButton.addEventListener('click', handleSubmit);
