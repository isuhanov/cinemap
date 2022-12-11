import { memo, useRef, useState } from "react";
import axios from "axios";


import './RegisterForm.css';
import API_SERVER_PATH from "../../lib/api/api-path";
import DragAndDropFiles from "../ui/DragAndDropFiles/DragAndDropFiles";
import { addUser } from "../../services/user-services/user-service";


const RegisterForm = memo(({ onClickClose, otherClassName }) => {
    // -------------------- ссылка на родительские блоки полей -------------------
    const loginParentRef = useRef();
    const passwordParentRef = useRef();
    const nameParentRef = useRef();
    const surnameParentRef = useRef();
    const statusParentRef = useRef();
    const photoParentRef = useRef();
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

    const onDropPhoto = (photo) => { // обработка значения поля photo
        setPhoto(prev => ({
            ...prev,
            ...photo
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
    // стейт для имени
    const [name, setName] = useState({
        value: '',
        error: '',
        parent: nameParentRef,
        isTouched: false,
        set: onNameChange
    });
    // стейт для фамилии
    const [surname, setSurname] = useState({
        value: '',
        error: '',
        parent: surnameParentRef,
        isTouched: false,
        set: onSurnameChange
    });
    // стейт для статуса
    const [status, setStatus] = useState({
        value: '',
        error: '',
        parent: statusParentRef,
        isTouched: false,
        set: onStatusChange
    });

    // стейт для статуса
    const [photo, setPhoto] = useState({
        value: [],
        error: '',
        parent: photoParentRef,
        isTouched: false,
        set: onDropPhoto
    });


    // объект для хранения полей формы
    const form = {
        login,
        password,
        name,
        surname,
        status,
        photo
    }

    function onClickSave(data) { //  post-запрос на добавление локации в БД 
        const formData = new FormData(); // объект для хранения данных отправляемой формы
        photo.value.forEach(element => {
            formData.append('photo', element);
        }); 
        for (const key in form) {
            formData.append(key, form[key].value);
        }
        addUser(formData).then(res => onClickClose())
    }


    return (
        <div className={`register-form-conrainer form-conrainer ${otherClassName}`}>
            <div className="register-form form animation-content">
                <header className="register-form__header header-card">
                    <p className="register-form-title title">
                        Регистрация
                    </p>
                    <div className="header-btn-container">
                        <button className="header-btn" onClick={ () => {
                            onClickClose();
                        }}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                </header>
                <div className="register-form__main">
                    <form>
                        <div className="field-block" ref={loginParentRef}>
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
                        </div>
                        <div className="field-block" ref={passwordParentRef}>
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
                        <div className="field-block" ref={nameParentRef}>
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
                        </div>
                        <div className="field-block" ref={surnameParentRef}>
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
                        </div>
                        <div className="field-block" ref={statusParentRef}>
                            <label htmlFor="location-name">
                                Статус:
                            </label>
                            <input type="text" 
                                    value={status.value} 
                                    onChange={(e) => onStatusChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field"
                            />
                        </div>
                        <div className="field-block" ref={photoParentRef}>
                            <label>
                                Фото из фильма:                              
                            </label>
                            {/* { isUpdate &&
                                <PhotoContainer isUpdate={isUpdate} onRemovePhotos={onRemovePhotos} 
                                photos={locationPhotos.filter(photo => photo.photo.locations_photo_status === 'film')
                                                    .map(photo => photo.photo)} 
                                />
                            } */}
                            <DragAndDropFiles photoList={photo.value} onDropFiles={onDropPhoto} />
                            { photo.error && 
                                <p>
                                    { photo.error }
                                </p>
                            }
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="form-btn-container btn-container">
                        <button type="button" onClick={onClickSave} className="register-form-btn-auth btn btn-blue">
                            Зарегистрироваться
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    )
});

export default RegisterForm;