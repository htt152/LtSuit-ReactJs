import api from '../api'
const getCurrentUserPoint = async (req) => {
    let res;
    await api.get(`/bangdiem/${req}`)
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default getCurrentUserPoint;