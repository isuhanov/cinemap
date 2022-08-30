import { memo } from "react";

import './LoginForm.css';

const LoginForm = memo(({ onClickClose }) => {
    return (
        <div className="login-form-conrainer form-conrainer">
            <div className="login-form  form">
                <header className="login-form__header header-card">
                    <p className="login-form-title title">
                        Авторизация
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={ onClickClose }>
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
                    <div className="form-btn-container btn-container">
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