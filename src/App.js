import './App.css';
import BGMap from './components/Map';
import Profile from './components/Profile';
import SearchInput from './components/SearchInput';
import SideBar from './components/SideBar';

function App() {
  return (
    <div className="App">
      <BGMap />
      <div className="container">
        <Profile />
        <SearchInput />
        <SideBar />
      </div>
    </div>
  );
}

export default App;
