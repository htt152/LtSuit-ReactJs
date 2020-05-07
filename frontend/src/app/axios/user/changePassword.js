import api from '../api'
const changePassword = async (req) => {
    let res
    await api.patch('/users/change',{
        id: req.id,
        token: req.token,
        password: req.password
    })
    .then((response) => {
        res = response
    })
    .catch((error) => {
        res = error.response
    })
    return res
} 

export default changePassword