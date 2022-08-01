import './App.css';
import BGMap from './components/BGMap';
import Profile from './components/Profile';
import SearchInput from './components/SearchInput';
import SideBar from './components/SideBar';

function App() {
  return (
    <div className="App">
      <BGMap />
      <div className="container">
        <div className="profile-block">
          <Profile />
        </div>
        <div className="search-input-block">
          <SearchInput />  
        </div>
        <div className="side-bar-block">
          <SideBar />
        </div>
      </div>
    </div>
  );
}

export default App;
