import api from "../api";
const getUserAdmin = async (req) => {
    const token = localStorage.getItem("token")
  let res;
  await api.get("/bangdiem/admin", {
    headers: {
      'Authorization': `Basic ${token}`
    }
    })
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    });
  return res;
};

export default getUserAdmin;
