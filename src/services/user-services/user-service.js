import axios from "axios";
import API_SERVER_PATH from "../../lib/api/api-path";

async function addUser(user) { // ф-ия добавления пользователя
    let response =await axios.post(`${API_SERVER_PATH}/users/registration`, user).catch(err => console.log(err));   
    return response;
}

const loginUser = (userData) => { // ф-ия сохранения пользвателя при авторизации
    localStorage.setItem('user', JSON.stringify(userData));
};

const logoutUser = () => { // ф-ия сохранения пользвателя при авторизации
    localStorage.removeItem('user');
};

export { addUser, loginUser, logoutUser };