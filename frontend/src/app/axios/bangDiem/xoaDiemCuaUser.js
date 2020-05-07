import api from '../api'
const xoaDiemUser = async (req) => {
    let res;
    await api.delete(`/bangdiem/delete`, {data:{
        email: req.email,
        _id: req._id
    }})
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
}

export default xoaDiemUser