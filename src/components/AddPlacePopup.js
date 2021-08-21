import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm"

function AddPlacePopup(props) {

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameValidationMessage, setNameValidationMessage] = useState('');
    const [linkValid, setLinkValid] = useState(false);
    const [linkValidationMessage, setLinkValidationMessage] = useState('');
    const [link, setLink] = useState('');

    function handleChangeName(e) {
        setName(e.target.value);
        setValidName(e.target.validity.valid);
        setNameValidationMessage(e.target.validationMessage);
    }

    function handleChangeLink(e) {
        setLink(e.target.value);
        setLinkValid(e.target.validity.valid);
        setLinkValidationMessage(e.target.validationMessage)
    }

    function handleAddPlaceSubmit(e) {
        e.preventDefault();
        props.handleClickSubmit();
        props.onAddPlace({
            name,
            link,
        });
    }

    useEffect(() => {
        setName('');
        setLink('');
        setLinkValid(false);
        setValidName(false);
    }, [props.isOpen]);
    

    return (
        <PopupWithForm
            title="Новое место"
            name="add-card"
            isOpen={props.isOpen}
            onClose={props.onClose}
            onClickOverlay={props.onClickOverlay}
            valid={validName && linkValid}
            buttonText={props.isSubmitting ? "Сохранение..." : "Сохранить"}
            onSubmit={handleAddPlaceSubmit}
        >
            <input value={name} onChange={handleChangeName} type="text" id="input-title" required minLength="2" maxLength="30" name="name"
                placeholder="Название" className="form__input form__input_type_title" />
            <span className={`input-name-error form__input-error ${!validName && 'form__input-error_active'}`}>{nameValidationMessage}</span>
            <input value={link} onChange={handleChangeLink} type="url" id="input-link" required name="link" placeholder="Ссылка на картинку"
                className="form__input form__input_type_link" />
            <span className={`input-name-error form__input-error ${!linkValid && 'form__input-error_active'}`}>{linkValidationMessage}</span>
        </PopupWithForm>
    )
}

export default AddPlacePopup;