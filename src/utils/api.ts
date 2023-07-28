import fetch from 'node-fetch';

async function get(endpoint: string, params: string = ''): Promise<any> {
    try {
        const apiURL = `http://${endpoint}/${params}`;
        const res = await fetch(apiURL);
        return await res.json();
    } catch (err) {
        console.log(err);
    }
}

async function post(endpoint: string) {
    const apiUrl = 'http://' + endpoint;
    const res = await fetch(apiUrl, {
        method: 'POST',
    });
    return await res.json();
}

export { get, post };
