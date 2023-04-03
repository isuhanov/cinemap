import axios from "axios";
import API_SERVER_PATH from "../../lib/api/api-path";
import socket from "../../lib/socket/socket";


async function addUser(user) { // ф-ия добавления пользователя
    // let response = await axios.post(`${API_SERVER_PATH}/users/registration`, user).catch(err => console.log(err));   
    let response = new Promise((resolve, reject) => {
        socket.emit('users:add', user, (res => {
            console.log(res);
        }))
    });
    return response;
}

const loginUser = (userData) => { // ф-ия сохранения пользвателя при авторизации
    localStorage.setItem('user', JSON.stringify(userData));
};

const logoutUser = () => { // ф-ия удаления пользвателя при логауте
    localStorage.removeItem('user');
};

export { addUser, loginUser, logoutUser };