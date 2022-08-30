import { useCallback, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap';
import LocationForm from './components/LocationForm';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import SearchInput from './components/SearchInput';
import SideBar from './components/SideBar';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false);
  const [isReload, setIsReload] = useState(false);

  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const logIn = useCallback(() => {
    
  }) 

  // const ReloadContext = createContext("without provider");

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
    // <ReloadContext.Provider value={onReload}>
      <div className="App">
        <BGMap reload={isReload} onReload={onReload}/>
        { isOpenLocationForm && <LocationForm onReload={onReload} onClickClose={closeLocationForm}/>}
        { isOpenLoginForm && <LoginForm onClickClose={closeLoginForm} /> }
        <div className="container">
          <div className="profile-block">
            <Profile user={authUser} onClickOpenLoginForm={openLoginForm}/>
          </div>
          <div className="search-input-block">
            <SearchInput />  
          </div>
          <div className="side-bar-block">
            <SideBar onClickAdd={openLocationForm} />
          </div>
        </div>
      </div>
    // </ReloadContext.Provider>
  );
}

// export {App, ReloadContext};
export default App;