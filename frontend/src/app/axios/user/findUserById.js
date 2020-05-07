import api from '../api'
const findUserById = async (req) => {
    let res;
    await api.post(`/users`, {
        id: req.id
    })
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
}

export default findUserById