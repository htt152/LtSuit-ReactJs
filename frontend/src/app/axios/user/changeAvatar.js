import api from '../api'
const changeAvatar = async (req) => {
    let res;
    await api.post(`/avatar`,{
        email: req.email,
        avatar: req.avatar
    })
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default changeAvatar;