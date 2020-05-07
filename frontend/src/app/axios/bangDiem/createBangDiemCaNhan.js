import api from "../api";
const createBangDiemCaNhan = async req => {
  let res;
  await api
    .post(`/bangdiem/create`, {
      userName: req.userName,
      userEmail: req.userEmail,
      name: req.name,
      learningPoints: req.learningPoints,
      basedPoints: req.basedPoints,
      danhSach: req.danhSach
    })
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    });
  return res;
};

export default createBangDiemCaNhan;
