import api from "../api";
const suaThongTin = async (req) => {
  let res;
  await api
    .patch(`/users/changeInformation`, {
        _id: req.editData._id,
        name: req.editData.name,
        email: req.editData.email,
        password: req.password,
        avatar: "",
        gioiThieu: req.editData.gioiThieu,
        diaChi: req.editData.diaChi,
        phone: req.editData.phone,
        ngaySinh: req.editData.ngaySinh,
        gioiTinh: req.editData.gioiTinh,
        phanLoai: req.editData.phanLoai,
        nghiepVu: req.editData.nghiepVu,
        kyNang: req.editData.kyNang,
    })
    .then((response) => {
      res = response;
    })
    .catch((error) => {
      res = error.response;
    });
  if (res.status >= 400) {
    return false;
  } else {
    return true;
  }
};

export default suaThongTin;
