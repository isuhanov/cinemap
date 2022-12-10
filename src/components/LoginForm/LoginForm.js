import { memo, useRef, useState } from "react";
import axios from "axios";


import './LoginForm.css';
import API_SERVER_PATH from "../../lib/api/api-path";
import { loginUser } from "../../services/user-services/user-service";

const LoginForm = memo(({ onClickClose }) => {
    const [isHide, setIsHide] = useState(false); // стейт для скрытия формы

    // -------------------- ссылка на родительские блоки полей -------------------
    const loginParentRef = useRef();
    const passwordParentRef = useRef();
    // ---------------------------------------------------------------------------

    const onLoginChange = (login) => { // обработка значения поля login
        setLogin(prev => ({
            ...prev,
            ...login
        }))
    }

    const onPasswordChange = (password) => { // обработка значения поля password
        setPassword(prev => ({
            ...prev,
            ...password
        }))
    }

    // стейт для логина
    const [login, setLogin] = useState({
        value: '',
        error: '',
        parent: loginParentRef,
        isTouched: false,
        set: onLoginChange
    }); 
    // стейт для пароля
    const [password, setPassword] = useState({
        value: '',
        error: '',
        parent: passwordParentRef,
        isTouched: false,
        set: onPasswordChange
    });


    function onClickAuth() { // ф-ия авторизации
        axios.post(`${API_SERVER_PATH}/users/login?user_login=${login.value}&user_pass=${password.value}`).then(res => {
            loginUser(res.data) // сохранение данных пользователя
            onClickClose(); // закрытие формы
        })
        .catch(err => console.log(err));
    }
    
    return (
        <div className={`login-form-conrainer form-conrainer ${isHide ? 'hided-form' : 'showed-form'}`}>
            <div className="login-form  form">
                <header className="login-form__header header-card">
                    <p className="login-form-title title">
                        Авторизация
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={ () => {
                            setIsHide(true);
                            setTimeout(() => {
                                onClickClose();
                            }, 600);
                        }}>
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
                            <input value={login.value} 
                                    onChange={(e) => onLoginChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field"
                            />
                        </div>
                        <div className="field-block">
                            <label htmlFor="location-name">
                                Пароль:
                            </label>
                            <input type="password" 
                                    value={password.value} 
                                    onChange={(e) => onPasswordChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field"
                            />
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="form-btn-container btn-container">
                        <button type="button" onClick={onClickAuth} className="login-form-btn-auth btn btn-blue">
                            Войти
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
});

export default LoginForm;