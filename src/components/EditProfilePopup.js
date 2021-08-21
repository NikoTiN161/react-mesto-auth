import PopupWithForm from "./PopupWithForm";
import { useState, useEffect, useContext } from 'react'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function EditProfilePopup(props) {

    const currentUser = useContext(CurrentUserContext);
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameValidationMessage, setNameValidationMessage] = useState('');
    const [aboutValidationMessage, setAboutValidationMessage] = useState('');
    const [description, setDescription] = useState('');
    const [validDescription, setValidDescription] = useState(false);


    useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
        setValidName(true);
        setValidDescription(true);
    }, [currentUser, props.isOpen])

    function handleChangeName(e) {
        setName(e.target.value);
        setValidName(e.target.validity.valid);
        setNameValidationMessage(e.target.validationMessage);
    }

    function handleChangeDescription(e) {
        setDescription(e.target.value);
        setValidDescription(e.target.validity.valid);
        setAboutValidationMessage(e.target.validationMessage);
    }

    function handleSubmit(e) {
        e.preventDefault();
        props.handleClickSubmit();
        props.onUpdateUser({
            name,
            about: description,
        });
    }

    return (
        <PopupWithForm
            title="Редактировать профиль"
            name="edit-profile"
            isOpen={props.isOpen}
            onClose={props.onClose}
            valid={validName && validDescription}
            onClickOverlay={props.onClickOverlay}
            buttonText={props.isSubmitting ? "Сохранение..." : "Сохранить"}
            onSubmit={handleSubmit}
        >
            <input type="text" id="input-name" required minLength="2" maxLength="40" name="name"
                placeholder="Имя профиля" className="form__input form__input_type_name"
                value={name} onChange={handleChangeName} />
            <span className={`input-name-error form__input-error ${!validName && 'form__input-error_active'}`}>{nameValidationMessage}</span>
            <input type="text" id="input-description" required minLength="2" maxLength="200" name="about"
                placeholder="Описание профиля" className="form__input form__input_type_description"
                value={description} onChange={handleChangeDescription} />
            <span className={`input-description-error form__input-error ${!validDescription && 'form__input-error_active'}`}>{aboutValidationMessage}</span>
        </PopupWithForm>
    )
}

export default EditProfilePopup;