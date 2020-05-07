import api from '../api'
const getAllUserPoint = async (req) => {
    let res;
    await api.get(`/bangdiem`)
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default getAllUserPoint;