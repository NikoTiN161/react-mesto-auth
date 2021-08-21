import Header from './Header'
import Main from './Main'
import Footer from './Footer'
import EditProfilePopup from './EditProfilePopup'
import EditAvatarPopup from './EditAvatarPopup'
import AddPlacePopup from './AddPlacePopup'
import ImagePopup from './ImagePopup'
import ConfirmPopup from './ConfirmPopup'
import React from 'react'
import { useState, useEffect } from 'react'
import api from '../utils/api'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isCardPopupOpen, setIsCardPopupOpen] = useState(false);
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [currentUser, setCurrentUser] = useState({ name: '', about: '' });
    const [cards, setCards] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header />
            <Main
                cards={cards}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleDeleteButtonClick}
            />
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
                onClickOverlay={handleClickOverlay} />

        </CurrentUserContext.Provider>
    );
}

export default App;
