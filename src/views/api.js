async function get(endpoint, params = '') {
    const apiUrl = `${endpoint}/${params}`;
    const res = await fetch(apiUrl);
    const result = await res.json();

    return result;
}

// api 로 POST 요청 (/endpoint 로, JSON 데이터 형태로 요청함)
async function post(endpoint, data, contentType = '') {
    const apiUrl = endpoint;
    if (contentType == 'meme') {
        const res = await fetch(apiUrl, {
            method: 'POST',
            body: data,
        });
        return await res.json();
    } else {
        const bodyData = JSON.stringify(data);
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: bodyData,
        });

        return await res.json();
    }
}

// api 로 PATCH 요청 (/endpoint/params 로, JSON 데이터 형태로 요청함)
async function patch(endpoint, params = '', data) {
    const apiUrl = `${endpoint}/${params}`;

    // JSON.stringify 함수: Javascript 객체를 JSON 형태로 변환함.
    // 예시: {name: "Kim"} => {"name": "Kim"}
    const bodyData = JSON.stringify(data);

    const res = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyData,
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
        const errorContent = await res.json();
        const { reason } = errorContent;

        throw new Error(reason);
    }

    const result = await res.json();

    return result;
}

// 아래 함수명에 관해, delete 단어는 자바스크립트의 reserved 단어이기에,
// 여기서는 우선 delete 대신 del로 쓰고 아래 export 시에 delete로 alias 함.
async function del(endpoint, params = '', data = {}) {
    const apiUrl = `${endpoint}/${params}`;
    const bodyData = JSON.stringify(data);

    const res = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: bodyData,
    });

    // 응답 코드가 4XX 계열일 때 (400, 403 등)
    if (!res.ok) {
        const errorContent = await res.json();
        const { reason } = errorContent;

        throw new Error(reason);
    }

    const result = await res.json();

    return result;
}

// 아래처럼 export하면, import * as Api 로 할 시 Api.get, Api.post 등으로 쓸 수 있음.
export { get, post, patch, del as delete };
