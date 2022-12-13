export const headers = {
    // 'Authorization': 'Bearer Test' 
    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.accessToken
}