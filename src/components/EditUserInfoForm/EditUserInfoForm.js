import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, setUser } from "../../redux/userSlice";
import FormField from "../../services/form-services/form-field";
import { formIsValid, loginFieldIsValid, textFieldIsValid } from "../../services/form-services/form-valid-services";
import { editUserInfo } from "../../services/user-services/user-service";
import ImgPicker from "../ui/ImgPicker/ImgPicker";

import './EditUserInfoForm.css' 

const EditUserInfoForm = memo(({ otherClassName, onClickClose }) => {
    const user = useSelector((state) => state.user.currentUser); // получение текущего пользователя
    const dispatch = useDispatch();


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

    const onPhotosChange = useCallback((photos) => { // обработка значения поля photo
        setPhotos(prev => ({
            ...prev,
            ...photos
        }));
    }, []);

    const setPhotoIsRemove = useCallback((id) => { // изменение статуса фотографии
        setPhotos(prev => ({
            ...prev,
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
    const [login, setLogin] = useState(new FormField(user?.user_login, useRef(), onLoginChange)); 
    // стейт для имени
    const [name, setName] = useState(new FormField(user?.user_name, useRef(), onNameChange));
    // стейт для фамилии
    const [surname, setSurname] = useState(new FormField(user?.user_surname, useRef(), onSurnameChange));
    // стейт для статуса
    const [status, setStatus] = useState(new FormField(user?.user_status, useRef(), onStatusChange));
    // стейт для фото
    const [photos, setPhotos] = useState(new FormField(user?.user_img_path ? [{
        id: user.user_id,
        path: user?.user_img_path,
        isRemove: false
    }] : [], useRef(), onPhotosChange));

    // объект для хранения полей формы
    const form = {
        login,
        name,
        surname,
        status,
    }

    useEffect(() => {
        // валидация полей формы (работает только при попытке ввода данных в поле из-за isTouched)
        if (form.login.isTouched) loginFieldIsValid(form.login, 100);
        if (form.name.isTouched) textFieldIsValid(form.name, 100);
        if (form.surname.isTouched) textFieldIsValid(form.surname, 100);
        if (form.status.isTouched) textFieldIsValid(form.status, 200, null);
    }, [login.value, name.value, surname.value, status.value])


    function onClickSave() { //  post-запрос на добавление локации в БД 
        if (!formIsValid(form, false, ['status'])) return
        post();
    }

    function post() {
        const formData = {
            body: {
                userId: user.user_id,
                login: login.value,
                name: name.value,
                surname: surname.value,
                status: status.value,
                deletePhotos: photos.value.filter(photo => photo.isRemove && !photo.file).map(photo => photo.path) 
            },
            files: photos.value.filter(photo => !photo.isRemove && photo.file).map(photo => ({
                name: photo.file.name,
                file: photo.file
            })),
        }
        console.log(formData);
        editUserInfo(formData).then(res => {
            dispatch(setUser(res));
            dispatch(setCurrentUser(res));
            onClickClose()
        }).catch(err => {
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
                            <textarea type="text" 
                                    value={status.value} 
                                    onChange={(e) => onStatusChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    className="field-textarea"
                            ></textarea>
                            
                            { status.error && 
                                <p>
                                    { status.error }
                                </p>
                            }
                        </div>
                        <div className="field-block" ref={status.parent}>
                            <label htmlFor="location-name">
                                Фото:
                            </label>
                            <ImgPicker photos={photos.value} onChange={onPhotosChange} setIsRemove={setPhotoIsRemove}/>
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="btn-container form-btn-container">
                        <button onClick={onClickSave} type="button" className="location-form-btn-edit btn btn-blue">
                            Сохранить
                        </button>
                    </div>
                </footer>
        </div>
    );
});

export default EditUserInfoForm;