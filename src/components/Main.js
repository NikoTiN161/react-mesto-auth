import React from 'react'
import Card from './Card'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main(props) {

    const currentUser = React.useContext(CurrentUserContext);

    return (
        <main className="content page__content">
            <section className="profile">
                <button type="button" style={{ backgroundImage: `url(${currentUser.avatar})` }} className="profile__avatar" onClick={props.onEditAvatar}></button>
                <div className="profile__info">
                    <h1 className="profile__username">{currentUser.name}</h1>
                    <p className="profile__description">{currentUser.about}</p>
                </div>
                <button type="button" className="profile__edit-button" onClick={props.onEditProfile}></button>
                <button type="button" className="profile__add-button" onClick={props.onAddPlace}></button>
            </section>
            <section className="elements">
                <ul className="elements__items">{
                    props.cards.map((card) => {
                        return (
                            <Card
                                key={card._id}
                                card={card}
                                onCardClick={props.onCardClick}
                                onCardLike={props.onCardLike}
                                onCardDelete={props.onCardDelete}
                                selectedCard={props.selectedCard}
                            />
                        )
                    })
                }
                </ul>
            </section>
        </main>
    )
}

export default Main;