import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import ConfirmPopup from './ConfirmPopup';
import React from 'react';
import { Route, Switch, useHistory, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useState, useEffect } from 'react';
import api from '../utils/api';
import auth from '../utils/auth';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Login from './Login';
import Register from './Register';

function App() {
    const token = localStorage.getItem('token');
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [currentUser, setCurrentUser] = useState({ name: '', about: '', _id: '', avatar: '' });
    const [cards, setCards] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
    const [emailUser, setEmailUser] = useState('');
    const history = useHistory();
    const location = useLocation();

        useEffect(() => {
        api.getUserInfo()
            .then((user) => {
                setCurrentUser(user);
            })
            .catch(err => console.error(err));

        api.getInitialCards()
            .then((cards) => {
                setCards(cards);
            })
            .catch(err => console.error(err));
        }, []);

    useEffect(() => {
        auth.tokenCheck(token)
            .then(data => {
                setLoggedIn(true);
                setEmailUser(data.data.email);
                history.push('/');
            })
            .catch(err => console.error(err));
    }, [history, location.pathname, token]);

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch(err => console.error(err));
    }

    function handleDeleteClick(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards((state) => state.filter((c) => c._id !== card._id));
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    function handleUpdateUser(updateUser) {
        api.updateUserInfo(updateUser)
            .then(newUser => {
                setCurrentUser(newUser);
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    function handleUpdateAvatar(link) {
        api.updateUserAvatar(link)
            .then(newUser => {
                setCurrentUser(newUser);
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    function handleAddPlaceSubmit(card) {
        api.addNewCard(card)
            .then(newCard => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch(err => console.error(err));
    }

    function handleDeleteButtonClick(card) {
        setIsConfirmPopupOpen(true);
        setSelectedCard(card);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setIsCardPopupOpen(true);
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setIsCardPopupOpen(false);
        setIsConfirmPopupOpen(false);
        setIsSubmitting(false);
        setIsRegisterPopupOpen(false);
    }

    function handleClickOverlay(e) {
        if (e.target.classList.contains('overlay')) {
            closeAllPopups();
        }
    }

    useEffect(() => {
        function closeByEscape(e) {
            if (e.key === 'Escape') {
                closeAllPopups();
            }
        }

        document.addEventListener('keydown', closeByEscape)

        return () => {
            document.removeEventListener('keydown', closeByEscape)
        }

    }, [])

    function handleClickSubmit() {
        setIsSubmitting(true);
    }

    function onLogin(email, password) {
        auth.login(email, password)
            .then((data) => {
                if (data.token) {
                    setLoggedIn(true);
                    history.push('/');
                }
            })
            .catch(err => console.log(err));
    }

    function onSignOut() {
        setLoggedIn(false);
        localStorage.removeItem('token');
        history.push('/sing-in');
    }

    function onRegister(email, password) {
        auth.register(email, password)
            .then(res => {
                console.log(res);
                if (!!res.data) {
                    history.push('/sing-in');
                    setRegisterSuccess(true);
                }
                setIsRegisterPopupOpen(true);
            })
            .catch(err => console.log(err));
    }


    return (
        <CurrentUserContext.Provider value={{ currentUser, emailUser, loggedIn }}>
            <Header onSignOut={onSignOut} />
            <Switch>
                <Route path="/sing-in">
                    <Login
                        onLogin={onLogin}
                        title="Вход"
                        buttonText="Войти"
                        registerSuccess={registerSuccess}
                        isOpen={isRegisterPopupOpen}
                        onClose={closeAllPopups}
                        onClickOverlay={handleClickOverlay}
                    />
                </Route>
                <Route path="/sing-up">
                    <Register
                        
                        onRegister={onRegister}
                        title="Регистрация"
                        buttonText="Зарегистрироваться"
                        registerSuccess={registerSuccess}
                        isOpen={isRegisterPopupOpen}
                        onClose={closeAllPopups}
                        onClickOverlay={handleClickOverlay}
                    />
                </Route>
                <ProtectedRoute
                    path="/"
                    component={Main}
                    cards={cards}
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeleteButtonClick}
                />
            </Switch>
            <Footer />


            <EditAvatarPopup
                isOpen={isEditAvatarPopupOpen}
                onClose={closeAllPopups}
                onClickOverlay={handleClickOverlay}
                isSubmitting={isSubmitting}
                handleClickSubmit={handleClickSubmit}
                onUpdateAvatar={handleUpdateAvatar}
            />

            <EditProfilePopup
                isOpen={isEditProfilePopupOpen}
                onClose={closeAllPopups}
                onClickOverlay={handleClickOverlay}
                isSubmitting={isSubmitting}
                handleClickSubmit={handleClickSubmit}
                onUpdateUser={handleUpdateUser}
            />

            <AddPlacePopup
                isOpen={isAddPlacePopupOpen}
                onClose={closeAllPopups}
                onClickOverlay={handleClickOverlay}
                isSubmitting={isSubmitting}
                handleClickSubmit={handleClickSubmit}
                onAddPlace={handleAddPlaceSubmit}
            />

            <ConfirmPopup
                card={selectedCard}
                isOpen={isConfirmPopupOpen}
                onClose={closeAllPopups}
                onClickOverlay={handleClickOverlay}
                isSubmitting={isSubmitting}
                handleClickSubmit={handleClickSubmit}
                onCardDelete={handleDeleteClick}
            />

            <ImagePopup
                card={selectedCard}
                isOpen={isCardPopupOpen}
                onClose={closeAllPopups}
                onClickOverlay={handleClickOverlay}
            />

        </CurrentUserContext.Provider>
    );
}

export default App;
