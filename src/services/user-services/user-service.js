import socket from "../../lib/socket/socket";


async function addUser(user) { // ф-ия добавления пользователя
    let response = new Promise((resolve, reject) => {
        socket.emit('users:add', user, (res => {
            console.log(res);
            if (res.status === 'success') {
                resolve(res);
            } else if (res.status === 'user exist') {
                reject(res.status);
            }
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