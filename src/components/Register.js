import useFormAndValidation from '../hooks/useFormAndValidation';
import InfoTooltip from './InfoTooltip';

function Register(props) {

    const { values, handleChange, errors, isValid } = useFormAndValidation();

    function handleSubmit(e) {
        e.preventDefault();
        props.onRegister(values.email, values.password);
    }

    return (
        <>
            <form onSubmit={handleSubmit} action="/signup" noValidate name="form-auth" className="form">
                <h2 className="form__header form__header_theme_white">{props.title}</h2>

                <input type="email" id="input-email" required minLength="5" maxLength="40" name="email"
                    placeholder="Email" className="form__input form__input_type_email form__input_theme_white"
                    value={values.email} onChange={handleChange} />
                <span className={`input-name-error form__input-error ${!isValid && 'form__input-error_active'}`}>{errors.email}</span>

                <input type="password" id="input-password" required minLength="6" maxLength="40" name="password"
                    placeholder="Пароль" className="form__input form__input_type_email form__input_theme_white"
                    value={values.password} onChange={handleChange} />
                <span className={`input-password-error form__input-error ${!isValid.password && 'form__input-error_active'}`}>{errors.password}</span>

                <button type="submit" className={`form__save-button form__save-button_theme_white ${!isValid && 'form__button_disabled'}`} disabled={!isValid}>{props.buttonText}</button>
                <a href="/sign-in" className="form__link">Уже зарегистрированы? Войти</a>
            </form>

            <InfoTooltip
            registerSuccess={props.registerSuccess}
            isOpen={props.isOpen}
            onClose={props.onClose}
            onClickOverlay={props.onClickOverlay}
            title={props.registerSuccess ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте ещё раз.'}
            />
        </>
    )
}

export default Register;