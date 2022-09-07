import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap/BGMap';
import LocationForm from './components/LocationForm/LocationForm';
import LoginForm from './components/LoginForm/LoginForm';
import Profile from './components/Profile/Profile';
import SearchInput from './components/SearchInput/SearchInput';
import SideBar from './components/SideBar/SideBar';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false);
  const [isReload, setIsReload] = useState(false);

  const [isOpenLoginForm, setIsOpenLoginForm] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  // useEffect(() => {
  //   // debugger
  //   const id = setInterval(() => {  // интервал для регулярного обновления данных из БД (каждую минуту)
  //     if (localStorage.getItem('token')) {
  //       loginUser();
  //     }
  //     // setIsMapReload(prev => !prev);
  //   }, 60000);
  //   // }, 10000);
  //   return () => clearInterval(id);
  // }, [])

  function loginUser() {
    console.log(localStorage.getItem('token'));
    const token = JSON.parse(localStorage.getItem('token')).token;
    axios.get(`http://localhost:8000/users?login=true`, { headers: {'Authorization' : `Bearer ${token}`} }).then(res => {
        console.log(res);
    }).catch(err => console.log(err)); 
    // setAuthUser(user);
  }

  const logIn = useCallback((user) => {
    localStorage.setItem('token', JSON.stringify(user));
    loginUser();
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
        { isOpenLoginForm && <LoginForm onLogin={logIn} onClickClose={closeLoginForm} /> }
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