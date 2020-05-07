import api from "../api";
const tuChoiDiem = async req => {
  let res;
  await api
    .patch(`/bangdiem/change-denied`, {
      data: req
    })
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    });
  if (res.status >= 400) {
    return false;
  } else {
    return true;
  }
};

export default tuChoiDiem;
