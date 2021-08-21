import { options } from './constants'

class Api {
    constructor(options) {
        this._baseUrl = options.baseUrl;
        this._headers = options.headers;
    }

    _checkResponse(res) {
        if (!res.ok) {
            return new Error(res.status);
        }
        return res.json();
    }

    getInitialCards() {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'GET',
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    getUserInfo() {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers
        })
            .then(this._checkResponse);
    }

    updateUserInfo(user) {
        return fetch(`${this._baseUrl}/users/me`, {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                name: user.name,
                about: user.about,
            })
        })
            .then(this._checkResponse);
    }

    updateUserAvatar({ link }) {
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            headers: this._headers,
            method: 'PATCH',
            body: JSON.stringify({
                avatar: link,

            })
        })
            .then(this._checkResponse);
    }

    addNewCard(card) {
        return fetch(`${this._baseUrl}/cards`, {
            headers: this._headers,
            method: 'POST',
            body: JSON.stringify({
                name: card.name,
                link: card.link,
            })
        })
            .then(this._checkResponse);;
    }

    deleteCard(id) {
        return fetch(`${this._baseUrl}/cards/${id}`, {
            headers: this._headers,
            method: 'DELETE',
        })
            .then(this._checkResponse);
    }

    _likeCard(id) {
        return fetch(`${this._baseUrl}/cards/likes/${id}`, {
            headers: this._headers,
            method: 'PUT',
        })
            .then(this._checkResponse);
    }

    _removeLikeCard(id) {
        return fetch(`${this._baseUrl}/cards/likes/${id}`, {
            headers: this._headers,
            method: 'DELETE',
        })
            .then(this._checkResponse);
    }

    changeLikeCardStatus(id, isChange) {
        if (isChange) {
            return this._likeCard(id);
        } else {
            return this._removeLikeCard(id);
        }
    }
}

const api = new Api(options);

export default api;