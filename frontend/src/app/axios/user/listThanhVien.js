import api from '../api'
const getListThanhVien = async (req) => {
    let apiResponse;
    if (req && req.searchString.length > 0){
        apiResponse = await api.get(`/thanhvien-search/${req.searchString}`)
    }
    else{
        apiResponse = await api.get(`/thanhvien-search/`)
    }
    let userArray = apiResponse.data.userArray
    let returnArray = []
    for (var i = 0; i < userArray.length;i++){
        returnArray.push({
            _id: userArray[i].userID,
            name: userArray[i].userName,
            email: userArray[i].userEmail,
            lang: userArray[i].kyNang,
            teams: userArray[i].teams,
            role: userArray[i].role
        })
    }
    return returnArray
} 

export default getListThanhVien;