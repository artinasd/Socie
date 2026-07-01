const API_URL = 'http://localhost:5000/api';

async function fetchApi(endpoint, method = 'GET', body = null) {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) options.body = JSON.stringify(body);
        const res = await fetch(`${API_URL}${endpoint}`, options);
        return await res.json();
    } catch (error) {
        return { data: null, error: error.message };
    }
}

export const api = {
    get: (e) => fetchApi(e),
    post: (e, b) => fetchApi(e, 'POST', b),
    put: (e, b) => fetchApi(e, 'PUT', b),
    delete: (e, b) => fetchApi(e, 'DELETE', b)
};