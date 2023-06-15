import { memo, useCallback, useEffect, useRef, useState } from "react";

import './RegisterForm.css';
import { addUser } from "../../services/user-services/user-service";
import FormField from "../../services/form-services/form-field";
import { formIsValid, loginFieldIsValid, passswordFieldIsValid, photosFieldIsValid, textFieldIsValid } from "../../services/form-services/form-valid-services";
import ImgPicker from "../ui/ImgPicker/ImgPicker";

/**
 * RegisterForm - компонент формы регистрации
 * 
 * Переменные:
 * login - стейт для логина
 * password - стейт для пароля
 * name - стейт для имени
 * surname - стейт для фамилии
 * status - стейт для статуса
 * photos - стейт для фото
 * form - объект для хранения полей формы
 * 
 * Функции:
 * onClickSave - обработчик нажатия на кнопку сохранения
 * post - добавление в БД
 * 
 */
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

    const onPhotosChange = useCallback((photos) => {
        setPhotos(prev => ({
            ...prev,
            isTouched: true,
            ...photos
        }));
    }, []);

    const setPhotoIsRemove = useCallback((id) => {
        setPhotos(prev => ({
            ...prev,
            isTouched: true,
            value: prev.value.map(photo => {
                if (photo.id === id) return {
                    ...photo,
                    isRemove: !photo.isRemove 
                };
                return photo;
            })
        }));
    }, []);

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
    // стейт для фото
    const [photos, setPhotos] = useState(new FormField([], useRef(), onPhotosChange));

    // объект для хранения полей формы
    const form = {
        login,
        password,
        name,
        surname,
        status,
        photos
    }

    useEffect(() => {
        // валидация полей формы (работает только при попытке ввода данных в поле из-за isTouched)
        if (form.login.isTouched) loginFieldIsValid(form.login, 100);
        if (form.password.isTouched) passswordFieldIsValid(form.password);
        if (form.name.isTouched) textFieldIsValid(form.name, 100);
        if (form.surname.isTouched) textFieldIsValid(form.surname, 100);
        if (form.status.isTouched) textFieldIsValid(form.status, 200, null);
        if (form.photos.isTouched) photosFieldIsValid({ formItem: form.photos, maxWidth: 1});
    }, [login.value, password.value, name.value, surname.value, status.value, JSON.stringify(photos.value)])



    function onClickSave() { //  post-запрос на добавление локации в БД 
        if (!formIsValid(form, false, ['status'])) return
        post();
    }

    function post() {
        const formData = {
            body: {
                login: login.value,
                password: password.value,
                name: name.value,
                surname: surname.value,
                status: status.value,
            },
            files: photos.value.filter(photo => !photo.isRemove).map(photo => ({
                name: photo.file.name,
                file: photo.file
            })),
        }
        console.log(formData);
        addUser(formData).then(res => onClickClose())
        .catch(err => {
            if (err === 'user exist') {
                login.parent.current.classList.add('error');
                login.set({
                    error: 'Логин занят',
                })
            } else {
                console.log(err);
            }
        })
    }


    return (
        <div className={`register-form-conrainer form-conrainer ${otherClassName}`}>
            <div className="register-form form animation-content">
                <header className="register-form__header header-card">
                    <p className="register-form-title title">
                        Регистрация
                    </p>
                    <div className="header-btn-container">
                        <button type="button" onClick={onClickSave} className="header-btn" >
                            <span className="material-symbols-outlined">done</span>
                        </button>
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
                            <label >
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
                            <label >
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
                        <div className="field-block" ref={photos.parent}>
                            <label>
                                Фото из профиля:                              
                            </label>
                            <ImgPicker photos={photos.value} onChange={onPhotosChange} setIsRemove={setPhotoIsRemove}/>
                            { photos.error && 
                                <p>
                                    { photos.error }
                                </p>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
});

export default RegisterForm;