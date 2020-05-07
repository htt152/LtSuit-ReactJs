import api from "../api";
const getHoatDongCaNhan = async req => {
  let res;
  await api
    .get("/hoatdong")
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    });
  return res;
};

export default getHoatDongCaNhan;
