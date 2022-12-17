import { memo, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";


import './RegisterForm.css';
import API_SERVER_PATH from "../../lib/api/api-path";
import DragAndDropFiles from "../ui/DragAndDropFiles/DragAndDropFiles";
import { addUser } from "../../services/user-services/user-service";
import FormField from "../../services/form-services/form-field";
import { formIsValid, loginFieldIsValid, passswordFieldIsValid, photosFieldIsValid, textFieldIsValid } from "../../services/form-services/form-valid-services";


const RegisterForm = memo(({ onClickClose, otherClassName }) => {
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



    const onDropPhoto = useCallback((photos) => { // обработка значения поля photo
        changePhotos(photos, setPhoto);
    })

    function changePhotos(photos, setPhoto) {
        let photosObj;
        if (Array.isArray(photos)) {
            photosObj = {value: photos, isTouched: true};
        } else if (typeof photos === 'object' && photos !== null) {
            photosObj = {...photos};    
        }
        setPhoto(prev => ({
            ...prev,
            ...photosObj
        }))
    }

    // стейт для логина
    const [login, setLogin] = useState(new FormField('', useRef(), onLoginChange)); 
    // стейт для пароля
    const [password, setPassword] = useState(new FormField('', useRef(), onPasswordChange));
    // стейт для имени
    const [name, setName] = useState(new FormField('', useRef(), onNameChange));
    // стейт для фамилии
    const [surname, setSurname] = useState(new FormField('', useRef(), onSurnameChange));
    // стейт для статуса
    const [status, setStatus] = useState(new FormField('', useRef(), onStatusChange));
    // стейт для статуса
    const [photo, setPhoto] = useState(new FormField([], useRef(), onDropPhoto));

    // объект для хранения полей формы
    const form = {
        login,
        password,
        name,
        surname,
        status,
        photo
    }

    useEffect(() => {
        // валидация полей формы (работает только при попытке ввода данных в поле из-за isTouched)
        if (form.login.isTouched) loginFieldIsValid(form.login, 100);
        if (form.password.isTouched) passswordFieldIsValid(form.password);
        if (form.name.isTouched) textFieldIsValid(form.name, 100);
        if (form.surname.isTouched) textFieldIsValid(form.surname, 100);
        if (form.status.isTouched) textFieldIsValid(form.status, 200);
        if (form.photo.isTouched) photosFieldIsValid({ formItem: form.photo, maxWidth: 1 });
    }, [login.value, password.value, name.value, surname.value, status.value, JSON.stringify(photo.value)])



    function onClickSave() { //  post-запрос на добавление локации в БД 
        if (!formIsValid(form)) return
        post();
    }

    function post() {
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
                                    className="field"
                            />
                            { status.error && 
                                <p>
                                    { status.error }
                                </p>
                            }
                        </div>
                        <div className="field-block" ref={photo.parent}>
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