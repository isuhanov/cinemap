import { useCallback, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap/BGMap';
import LocationForm from './components/LocationForm/LocationForm';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import SearchInput from './components/SearchInput/SearchInput';
import SideBar from './components/SideBar/SideBar';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false); // стейт для состояния формы авторизации
  const [isReload, setIsReload] = useState(false); // стейт для обновления приложения

  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false); // стейт состояния формы авторизации

  const [markerPos, setMarkerPos] = useState(undefined); // стейт для позиции маркера при добавлении


  const loginUser = useCallback((userData) => { // ф-ия сохранения пользвателя при авторизации
    localStorage.setItem('user', JSON.stringify(userData));
  });

  const moveToMarker = useCallback((newMarkerPos) => { // ф-ия установки координт нового маркера для плавного перехода
    setMarkerPos(newMarkerPos);
  })

  const onReload = useCallback(() => { // ф-ия для обновления
    setIsReload(prev => !prev);
    console.log('reload');
  });
  
  const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
    setIsOpenLocationForm(true);
  });

  const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
    setIsOpenLocationForm(false);
  });


  const openLoginForm = useCallback(() => { // ф-ия для откытия формы авторизации
    setIsOpenLoginForm(true);
    console.log('open');
  });

  const closeLoginForm = useCallback(() => { // ф-ия для закрытия формы авторизации
    setIsOpenLoginForm(false);
  });
  
  return (
      <div className="App">
        <BGMap reload={isReload} markerPos={markerPos} onReload={onReload}/>
        { isOpenLocationForm && <LocationForm moveToMarker={moveToMarker} onReload={onReload} onClickClose={closeLocationForm}/>}
        { isOpenLoginForm && <LoginForm onLogin={loginUser} onClickClose={closeLoginForm} /> }
        <div className="container">
          <div className="profile-block">
            <Profile user={JSON.parse(localStorage.getItem('user'))} onClickOpenLoginForm={openLoginForm}/>
          </div>
          <div className="search-input-block">
            <SearchInput />  
          </div>
          <div className="side-bar-block">
            <SideBar onClickAdd={openLocationForm} />
          </div>
        </div>
      </div>
  );
}

export default App;