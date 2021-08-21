import React, { useEffect, useState } from "react"
import PopupWithForm from "./PopupWithForm"

function EditAvatarPopup(props) {

    const urlRef = React.useRef();
    const [link, setLink] = useState('');
    const [linkValid, setLinkValid] = useState(false);
    const [linkValidationMessage, setLinkValidationMessage] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        props.handleClickSubmit();
        props.onUpdateAvatar({
            link: urlRef.current.value,
        });
    }

    function handleChangeLink(e) {
        setLink(e.target.value);
        setLinkValid(e.target.validity.valid);
        setLinkValidationMessage(e.target.validationMessage);
    }

    useEffect(() => {
        urlRef.current.value = '';
        setLinkValid(false);
    }, [props.isOpen]);

    return (
        <PopupWithForm
            title="Обновить аватар"
            name="update-avatar"
            isOpen={props.isOpen}
            onClose={props.onClose}
            valid={linkValid}
            onClickOverlay={props.onClickOverlay}
            buttonText={props.isSubmitting ? "Сохранение..." : "Сохранить"}
            onSubmit={handleSubmit}
        >
            <input ref={urlRef} value={link} onChange={handleChangeLink} type="url" id="input-url" required name="link" placeholder="Ссылка на картинку"
                className="form__input form__input_type_link" />
            <span className={`input-url-error form__input-error ${!linkValid && 'form__input-error_active'}`}>{linkValidationMessage}</span>
        </PopupWithForm>
    )
}

export default EditAvatarPopup;