import { memo, useRef, useState } from "react";
import FormField from "../../services/form-services/form-field";

import './EditUserInfoForm.css' 

const EditUserInfoForm = memo(({ otherClassName, onClickClose }) => {
    const onLoginChange = (login) => { // обработка значения поля login
        setLogin(prev => ({
            ...prev,
            ...login
        }))
    }

    const onNameChange = (name) => { // обработка значения поля name
        setName(prev => ({
            ...prev,
            ...name
        }))
    }
    
    const onSurnameChange = (surname) => { // обработка значения поля surname
        setSurname(prev => ({
            ...prev,
            ...surname
        }))
    }

    const onStatusChange = (status) => { // обработка значения поля status
        setStatus(prev => ({
            ...prev,
            ...status
        }))
    }

       // стейт для логина
       const [login, setLogin] = useState(new FormField('', useRef(), onLoginChange)); 
       // стейт для имени
       const [name, setName] = useState(new FormField('', useRef(), onNameChange));
       // стейт для фамилии
       const [surname, setSurname] = useState(new FormField('', useRef(), onSurnameChange));
       // стейт для статуса
       const [status, setStatus] = useState(new FormField('', useRef(), onStatusChange));
   
       // объект для хранения полей формы
       const form = {
           login,
           name,
           surname,
           status,
       }
    return (
        <div className={`profile-card profile-form form ${otherClassName}`}>
            <header className="user-info-form__header header-card">
                <p className="location-form-title title">
                    Редактирование профиля
                </p>
                <div className="header-btn-container">
                    <button className="header-btn" onClick={onClickClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>
            <div className="register-form__main">
                    <form>
                        <div className="field-block" ref={login.parent}>
                            <label htmlFor="registerform-login">
                                Логин:
                            </label>
                            <input value={login.value} 
                                    onChange={(e) => onLoginChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field"
                            />
                            { login.error && 
                                <p>
                                    { login.error }
                                </p>
                            }
                        </div>
                        <div className="field-block" ref={name.parent}>
                            <label htmlFor="location-name">
                                Имя:
                            </label>
                            <input type="text" 
                                    value={name.value} 
                                    onChange={(e) => onNameChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field"
                            />
                            { name.error && 
                                <p>
                                    { name.error }
                                </p>
                            }
                        </div>
                        <div className="field-block" ref={surname.parent}>
                            <label htmlFor="location-name">
                                Фамилия:
                            </label>
                            <input type="text" 
                                    value={surname.value} 
                                    onChange={(e) => onSurnameChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field"
                            />
                            { surname.error && 
                                <p>
                                    { surname.error }
                                </p>
                            }
                        </div>
                        <div className="field-block" ref={status.parent}>
                            <label htmlFor="location-name">
                                Статус:
                            </label>
                            <input type="text" 
                                    value={status.value} 
                                    onChange={(e) => onStatusChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field-textarea"
                            />
                            { status.error && 
                                <p>
                                    { status.error }
                                </p>
                            }
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="btn-container form-btn-container">
                        <button type="button" className="location-form-btn-edit btn btn-blue">
                            Сохранить
                        </button>
                    </div>
                </footer>
        </div>
    );
});

export default EditUserInfoForm;