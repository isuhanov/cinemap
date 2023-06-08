import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import FormField from "../../services/form-services/form-field";
import ImgPicker from "../ui/ImgPicker/ImgPicker";
import UserBox from "../UserBox/UserBox";
import socket from "../../lib/socket/socket";
import SelectedUserItem from "../ui/SelectedUserItem/SelectedUserItem";
import { formIsValid, photosFieldIsValid, textFieldIsValid } from "../../services/form-services/form-valid-services";

import './ChatCreateForm.css';


// компонент формы создания многопользовательского чата
const ChatCreateForm = memo(({ onClickClose, openChatCard, otherClassName }) => {
    const [users, setUsers] = useState([]); // стейт для списка пользователей
    const currentUser = useSelector((state) => state.user.currentUser); // стейт для текущего пользователя

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


    async function update() {  // ф-ия обновления списка пользователей 
        socket.emit(`users:get`, currentUser.user_id, (response) => {
            if (response.status === 'success') setUsers(response.users);
        });
    }

    useEffect(() => { // получение пользователей
        update();
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

    const onSelectedUsersChange = (users) => { // обработка значения поля selectedUsers
        setSelectedUsers(prev => ({
            ...prev,
            ...users
        }));
    };

    const setSelectedUsersChecked = (user) => { // ф-ия изменения выбора пользователя
        selectedUsers.value.find(selectedUser => selectedUser.id === user.id) ?  // если пользователь выбран, то список фильтруется, иначе пользователь добавляется
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


    function onClickCreate() { //  post-запрос на добавление локации в БД 
        if (!formIsValid(form, false)) return;
        post();
    }

    function post() {
        const formData = {
            name: name.value,
            photo: photo.value.filter(photo => !photo.isRemove).map(photo => ({
                name: photo.file.name,
                file: photo.file
            }))[0],
            users: [...selectedUsers.value.map(user => ({user_id: user.id})), {user_id: currentUser.user_id}]
        }

        socket.emit('chats:create', formData, (response) => { // создание чата
            if (response.status === 'success'){
                const body = {
                    chat_messege_text: `${currentUser.user_login} начал чат ${name.value}`,
                    chat_messege_is_read: 0,
                    chat_messege_is_edit: 0,
                    chat_messege_type: 'info',
                    chat_messege_reply_id: null,
                    chat_id: response.chatId,
                    user_id: currentUser.user_id
                }
                socket.emit('messages:add', body, (status) => { // добавление сообщения о начале чата
                    if (status !== 'success') console.log(status);
                    else {
                        onClickClose();
                        openChatCard({chatId: response.chatId});
                    }
                });
            }
        })
    }

    return (
        <div className={`location-card chat-card chat-create-card ${otherClassName}`}>
            <header className="header-card chat-card__header">
                <p className="location-card-title title">
                    Создание чата
                </p>
                <div className="header-btn-container">
                    <button className="header-btn" onClick={onClickCreate} type="button">
                        <span className="material-symbols-outlined">done</span>
                    </button>
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
        </div>
    );
});

export default ChatCreateForm;