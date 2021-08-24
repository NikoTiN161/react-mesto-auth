import { authOption } from './constants'

class Auth {
    constructor(authOption) {
        this._baseUrl = authOption.baseUrl;
        this._headers = authOption.headers;
    }

    login(email, password) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({ password, email })
        })
            .then((response => response.json()))
            .then((data) => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    return data;
                }
            })
            .catch(err => console.log(err));
    }

    register(email, password) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password, email })
        })
            .then((response) => {
                if (response) {
                    return response.json();
                } 
                // else return new Error(response.error);
            })
            // .then((res) => {
            //     return res;
            // })
            .catch((err) => console.log(err));
    };

    tokenCheck(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else new Error(res.message);
            })
            .then(data => { if (data) return data; })
            .catch(err => console.log(err));
    }
}
const auth = new Auth(authOption);
export default auth;