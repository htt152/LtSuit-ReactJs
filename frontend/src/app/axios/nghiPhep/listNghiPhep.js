import api from '../api'
const getListNghiPhep = async (req) => {
    let res;
    await api.get(`/nghiphep/${req.userEmail}`)
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default getListNghiPhep;