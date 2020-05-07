import api from "../api";
const xacNhanDiem = async req => {
  let res;
  await api
    .patch(`/bangdiem/change-approved`, {
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

export default xacNhanDiem;
