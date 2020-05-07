import api from "../api";
const getBangDiemCaNhan = async req => {
  let res;
  await api
    .post("/bangdiem/canhan", {
      email: req.email
    })
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    });
  return res;
};

export default getBangDiemCaNhan;
