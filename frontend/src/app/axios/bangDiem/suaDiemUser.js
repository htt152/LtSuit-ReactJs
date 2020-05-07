import api from '../api'
const suaDiemUser = async (req) => {
    let res;
    await api.patch(`/bangdiem/change`, {data:{
        email: req.email,
        _id : req.id,
        title: req.title,
        type: req.type,
        hoatDongID: req.hoatDongID,
        description: req.description,
        date: req.date
    }})
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    if (res.status >= 400){
        return false   
    }
    else{
        return true
    }
}

export default suaDiemUser