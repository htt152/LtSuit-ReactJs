import api from '../api'
const findUser = async (req) => {
    let res;
    await api.post(`/user`,{
        username:req.username,
        email:req.email,
        token:req.token
    })
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default findUser;