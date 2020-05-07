import api from '../api'
const xacNhanNghiPhepAPI = async (req) => {
    let res;
    let returnArray = {
        nguoiLienQuan:[],
        teamLienQuan:[]
    };
    for (var i = 0; i < req.nguoiLienQuan.length;i++){
        if (req.nguoiLienQuan[i].type==="user"){
            returnArray.nguoiLienQuan.push({
                userEmail: req.nguoiLienQuan[i].uniqueValue,
                userName: req.nguoiLienQuan[i].value
            })
        }
        else{
            returnArray.teamLienQuan.push({
                teamID: req.nguoiLienQuan[i].uniqueValue,
                teamName: req.nguoiLienQuan[i].value
            })
        }
    }
    await api.post(`/nghiphep/create`,{
        userEmail: req.userEmail,
        userName: req.userName,
        nghiPhep:[{
            nghiTu:req.nghiTu,
            nghiDen:req.nghiDen,
            lyDoNghi:req.lyDoNghi,
            benLienQuan:returnArray,
            mucDoAnhHuong:req.mucDoAnhHuong,
            phuongAnKhacPhuc:req.phuongAnKhacPhuc
        }]
    })
    .then(response => {
        res = response
    })
    .catch(error => {
        res = error.response
    })
    return res
} 

export default xacNhanNghiPhepAPI;