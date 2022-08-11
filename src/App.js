import { useEffect, useState } from 'react';
import './App.css';
import BGMap from './components/BGMap';
import LocationForm from './components/LocationForm';
import Profile from './components/Profile';
import SearchInput from './components/SearchInput';
import SideBar from './components/SideBar';

function App() {
  const [isOpenLocationForm, setIsOpenLocationForm] = useState(false);
  const [isReload, setIsReload] = useState(false);

  function onReload() { // ф-ия для обновления
    setIsReload(prev => !prev);
  }

  function openLocationForm() { // ф-ия для откытия формы локации
    setIsOpenLocationForm(true);
  }

  function closeLocationForm() { // ф-ия для закрытия формы локации
    setIsOpenLocationForm(false);
  }  

  return (
    <div className="App">
      <BGMap reload={isReload} onReload={onReload}/>
      { isOpenLocationForm && <LocationForm onReload={onReload} onClickClose={closeLocationForm}/>}
      <div className="container">
        <div className="profile-block">
          <Profile />
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
