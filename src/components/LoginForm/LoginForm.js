import { memo, useRef, useState } from "react";
import axios from "axios";


import './LoginForm.css';
import API_SERVER_PATH from "../../lib/api/api-path";
import { loginUser } from "../../services/user-services/user-service";
import FormField from "../../services/form-services/form-field";
import { useDispatch } from "react-redux";
import { setWithFavoutites } from "../../redux/locationsSlice";
import { setCurrentUser } from "../../redux/userSlice";

const LoginForm = memo(({ onClickClose, otherClassName }) => {
    const dispatch = useDispatch();

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
    const [login, setLogin] = useState(new FormField('', useRef(), onLoginChange)); 
    
    // стейт для пароля
    const [password, setPassword] = useState(new FormField('', useRef(), onPasswordChange));


    function onClickAuth() { // ф-ия авторизации
        if (login.value.trim().length === 0 || password.value.trim().length === 0) {
            setError('Поля не должны быть пустыми')
        } else {
            axios.post(`${API_SERVER_PATH}/users/login`, {login: login.value, password: password.value}).then(res => {
                loginUser(res.data) // сохранение данных пользователя
                dispatch(setCurrentUser(res.data));
                dispatch(setWithFavoutites());
                onClickClose(); // закрытие формы
            })
            .catch(err => {
                console.log(err);
                setError('Неверный логин или пароль')
            });
        }
    }

    function setError(error) {
        login.parent.current.classList.add('error');
        password.parent.current.classList.add('error');
        password.set({
            error,
        })
    }
    
    return (
        <div className={`login-form-conrainer form-conrainer ${otherClassName}`}>
            <div className="login-form form animation-content">
                <header className="login-form__header header-card">
                    <p className="login-form-title title">
                        Авторизация
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={ () => {
                            onClickClose();
                        }}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="login-form__main">
                    <form>
                        <div className="field-block" ref={login.parent}>
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
                        <div className="field-block" ref={password.parent}>
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
                            { password.error && 
                                <p>
                                    { password.error }
                                </p>
                            }
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