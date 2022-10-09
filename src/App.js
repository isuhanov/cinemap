import { useCallback, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap/BGMap';
import FavoritesList from './components/FavoritesList/FavoritesList';
import LocationForm from './components/LocationForm/LocationForm';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import SearchInput from './components/SearchInput/SearchInput';
import SideBar from './components/SideBar/SideBar';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false); // стейт для состояния формы авторизации
  const [isReload, setIsReload] = useState(false); // стейт для обновления приложения
  const openLocationForm = useCallback(() => { // ф-ия для откытия формы локации
    setIsOpenLocationForm(true);
  });
  const closeLocationForm = useCallback(() => { // ф-ия для закрытия формы локации
    setIsOpenLocationForm(false);
  });


  const [markerPos, setMarkerPos] = useState(undefined); // стейт для позиции маркера при добавлении
  const moveToMarker = useCallback((newMarkerPos) => { // ф-ия установки координт нового маркера для плавного перехода
    setMarkerPos(newMarkerPos);
  })


  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false); // стейт состояния формы авторизации
  const openLoginForm = useCallback(() => { // ф-ия для откытия формы авторизации
    setIsOpenLoginForm(true);
  });
  const closeLoginForm = useCallback(() => { // ф-ия для закрытия формы авторизации
    setIsOpenLoginForm(false);
  });

  const loginUser = useCallback((userData) => { // ф-ия сохранения пользвателя при авторизации
    localStorage.setItem('user', JSON.stringify(userData));
  });

  const logoutUser = useCallback(() => { // ф-ия сохранения пользвателя при авторизации
    localStorage.removeItem('user');
  });


  const [isOpenFavoritesList, setIsOpenFavoritesList] = useState(false); // стейт состояния карточки "Избранное"
  const openFavoritesList = useCallback(() => { // ф-ия для откытия формы авторизации
    setIsOpenFavoritesList(true);
  });
  const closeFavoritesList = useCallback(() => { // ф-ия для закрытия формы авторизации
    setIsOpenFavoritesList(false);
  });

  const onReload = useCallback(() => { // ф-ия для обновления
    setIsReload(prev => !prev);
    console.log('reload');
  });
  
  
  return (
      <div className="App">
        <BGMap reload={isReload} markerPos={markerPos} onReload={onReload}/>
        { isOpenLocationForm && <LocationForm moveToMarker={moveToMarker} onReload={onReload} onClickClose={closeLocationForm}/>}
        { isOpenLoginForm && <LoginForm onLogin={loginUser} onClickClose={closeLoginForm} /> }
        { isOpenFavoritesList && <FavoritesList /> }
        <div className="container">
          <div className="profile-block">
            <Profile user={JSON.parse(localStorage.getItem('user'))} onLogoutClick={logoutUser} onClickOpenLoginForm={openLoginForm}/>
          </div>
          <div className="search-input-block">
            <SearchInput />  
          </div>
          <div className="side-bar-block">
            <SideBar onClickAdd={openLocationForm} onClickFavorites={openFavoritesList}/>
          </div>
        </div>
      </div>
  );
}

export default App;