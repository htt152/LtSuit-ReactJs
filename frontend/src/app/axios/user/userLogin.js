import api from '../api'
const postLoginUser = async (req) => {
    let res;
    await api.post(`/users/login`,{
        username:req.username,
        password:req.password
    })
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default postLoginUser;