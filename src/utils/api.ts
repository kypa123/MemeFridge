async function get(endpoint: string, params: string = '') {
    const apiUrl = `${endpoint}/${params}`;
    const res = await fetch(apiUrl);
    return await res.json();
}

async function post(endpoint: string) {
    const apiUrl = endpoint;
    const res = await fetch(apiUrl, {
        method: 'POST',
    });
    return await res.json();
}

export { get, post };
