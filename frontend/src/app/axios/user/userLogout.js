import api from '../api'
import history from '@history'
const logoutUser = () => {
    const token =  localStorage.getItem('token')
    if(!token){
        history.push('/login')
    }
    const username = localStorage.getItem('email')
    api.post('/users/logout',{username,token})
        .then(res => {
            if(res.status === 200){
                localStorage.removeItem('email')
                localStorage.removeItem('username')
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                localStorage.removeItem('name')
                localStorage.removeItem('id')
                localStorage.removeItem('_id')
                history.push('/login')
            }
        })
}

export default logoutUser;