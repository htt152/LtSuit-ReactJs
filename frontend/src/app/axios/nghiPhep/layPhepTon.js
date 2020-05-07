import api from '../api'
const getPhepTon = async (req) => {
    let res;
    await api.get(`/layPhepTon/${req}`)
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default getPhepTon;