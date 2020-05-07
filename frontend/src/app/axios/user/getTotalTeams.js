import api from "../api";
const getTotalTeams = async (req) => {
  let res;
  if (req && req.searchString) {
    res = await api.get(`/teamListLength/${req.searchString}`);
  } else {
    res = await api.get(`/teamListLength/`);
  }
  return parseInt(res.data);
};

export default getTotalTeams;
