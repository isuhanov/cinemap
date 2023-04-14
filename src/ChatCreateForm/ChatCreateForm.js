import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import FormField from "../services/form-services/form-field";
import ImgPicker from "../components/ui/ImgPicker/ImgPicker";
import UserBox from "../components/UserBox/UserBox";
import socket from "../lib/socket/socket";
import SelectedUserItem from "../components/ui/SelectedUserItem/SelectedUserItem";
import { photosFieldIsValid, textFieldIsValid } from "../services/form-services/form-valid-services";

import './ChatCreateForm.css';

const ChatCreateForm = memo(({ onClickClose, otherClassName }) => {
    const [users, setUsers] = useState([]);
    const currentUser = useSelector((state) => state.user.currentUser);

    const [searchValue, setSearchValue] = useState('');  // стейт для значения поля поиска
    const [isVisibleBtn, setIsVisibleBtn] = useState(false); // стейт для отображения кнопки отмены поиска
    function onSearchChange(e) {  // ф-ия изменения поля ввода
        const value = e.target.value;
        setSearchValue(value); 
        if (value.trim() === '')  { // если значение пустое, то убрать кнопки и сбросить поиск
            setIsVisibleBtn(false);
            update();
        } else {  // иначе отфильтровать нужный список
            setIsVisibleBtn(true);
            socket.emit(`users:filter`, currentUser.user_id, value.trim(), (response) => {
                if (response.status === 'success') {
                    setUsers(response.users);
                }
            });
        }
    }


    async function update() {  // ф-ия обновления списков списка 
        socket.emit(`users:get`, currentUser.user_id, (response) => {
            if (response.status === 'success') setUsers(response.users);
            console.log(response.users);
        });
    }

    useEffect(() => {
        socket.emit(`users:get`, currentUser.user_id, (response) => {
            if (response.status === 'success') setUsers(response.users);
            console.log(response.users);
        });
    }, []);

    const onNameChange = (name) => { // обработка значения поля названия локации
        setName(prev => ({
            ...prev,
            ...name
        }))
    }

    const setPhotoIsRemove = useCallback((id) => {  // изменение статуса фотографии пользователя
        setPhoto(prev => ({
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

    const onPhotoChange = useCallback((photos) => { // обработка значения поля usersPhoto
        setPhoto(prev => ({
            ...prev,
            isTouched: true,
            ...photos
        }));
    }, []);

    const onSelectedUsersChange = (users) => { // обработка значения поля usersPhoto
        setSelectedUsers(prev => ({
            ...prev,
            ...users
        }));
    };

    const setSelectedUsersChecked = (user) => {
        selectedUsers.value.find(selectedUser => selectedUser.id === user.id) ? 
            onSelectedUsersChange({value: selectedUsers.value.filter(selectedUser => selectedUser.id !== user.id), isTouched: true})
        :
            onSelectedUsersChange({value: [...selectedUsers.value, user], isTouched: true});

    }

    
    // стейт для названия чата
    const [name, setName] = useState(new FormField('', useRef(), onNameChange)); 
    // стейт для фото чата
    const [photo, setPhoto] = useState(new FormField([], useRef(), onPhotoChange));
    // стейт для выбранных пользователей
    const [selectedUsers, setSelectedUsers] = useState(new FormField([], useRef(), onSelectedUsersChange));

    // объект для хранения полей формы
    const form = {
        name,
        photo,
        selectedUsers
    }

    
    useEffect(() => {
        // валидация полей формы (работает только при попытке ввода данных в поле из-за isTouched)
        if (form.name.isTouched) textFieldIsValid(form.name, 200);
        if (form.photo.isTouched) photosFieldIsValid({ formItem:form.photo, maxWidth:1 });
    }, [name.value, JSON.stringify(photo.value)])

    return (
        <div className={`location-card chat-card ${otherClassName}`}>
            <header className="header-card chat-card__header">
                <p className="location-card-title title">
                    Создание чата
                </p>
                <div className="header-btn-container">
                    <button className="header-btn" onClick={onClickClose}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            </header>       
            <div className="chat-create-form__main">
                    <form>
                        <div className="field-block" ref={name.parent}>
                            <label htmlFor="name">
                                Название чата:
                            </label>
                            <input  value={name.value} 
                                    onChange={(e) => onNameChange({
                                        value: e.target.value,
                                        isTouched: true
                                    })}
                                    id="name" className="field"
                            />
                            { name.error && 
                                <p>
                                    { name.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={photo.parent}>
                            <label>
                                Фото чата:                               
                            </label>
                            <ImgPicker photos={photo.value} onChange={onPhotoChange} setIsRemove={setPhotoIsRemove}/>
                            { photo.error && 
                                <p>
                                    { photo.error }
                                </p>
                            }
                        </div>

                        <div className="field-block" ref={selectedUsers.parent}>
                            <label>
                                Пользователи:                               
                            </label>
                            <div className="select-user-conatiner">
                                { selectedUsers.value.map(user => (
                                    <SelectedUserItem 
                                        key={user.id} 
                                        user={user}
                                        onClickRemove={setSelectedUsersChecked}
                                    />
                                ))}
                            </div>
                            { selectedUsers.error && 
                                <p>
                                    { selectedUsers.error }
                                </p>
                            } 
                        </div>
                        <div className="select-user">
                            <div className="user-search">
                                <input onChange={e => {
                                            onSearchChange(e);
                                        }} value={searchValue} 
                                    placeholder="Поиск..." 
                                    className="subsearch-input"/>
                                { isVisibleBtn &&
                                    <button onClick={() => {
                                        setSearchValue('');
                                        setIsVisibleBtn(false);
                                        update();
                                    }} className="subsearch-btn clean-btn">
                                        <span className="material-symbols-outlined" >close</span>
                                    </button>  
                                }
                            </div>

                            <div className="users-list">
                                { users.map(user => (
                                    <label key={user.user_id} className="checkbox-container">
                                        <input type="checkbox" 
                                                checked={selectedUsers.value.find(selectedUser => selectedUser.id === user.user_id) ? true: false}
                                                onChange={e => {
                                                    setSelectedUsersChecked({
                                                            id: user.user_id,
                                                            login: user.user_login,
                                                            avatar: user.user_img_path
                                                        }
                                                    );
                                                }}
                                        />
                                        <span className="checkmark"></span>
                                        <UserBox user={user}
                                                otherClassName="user-checkbox" />
                                    </label>
                                    )
                                )}
                            </div>
                        </div>
                    </form>
                </div>
                <footer>
                    <div className="btn-container form-btn-container">
                        <button type="button" className="location-form-btn-edit btn btn-blue">
                            Создать
                        </button>
                    </div>
                </footer>                 
        </div>
    );
});

export default ChatCreateForm;