import { memo } from "react";

const LoginForm = memo(({ onClickClose }) => {
    return (
        <div className="login-form-conrainer">
            <div className="login-form">
                <header className="location-card__header">
                    <p className="location-title title">
                        Авторизация
                    </p>
                    <div className="location-card__btn-container">
                        <button className="location-card__btn" onClick={ onClickClose }>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="login-form__main">
                    <form>
                        <div className="field-block">
                            <label htmlFor="loginform-login">
                                Логин:
                            </label>
                            <input className="field"/>
                        </div>
                        <div className="field-block">
                            <label htmlFor="location-name">
                                Пароль:
                            </label>
                            <input type="password" className="field"/>
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="location-form-btn-container">
                        <button type="button" className="location-card-btn location-card-btn-edit">
                            Сохранить
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
});

export default LoginForm;