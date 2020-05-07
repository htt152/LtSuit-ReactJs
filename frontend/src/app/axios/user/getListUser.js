import api from '../api'
const getListUser = async (req) => {
    let res;
    await api.get(`/search/${req.searchString}`)
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default getListUser;