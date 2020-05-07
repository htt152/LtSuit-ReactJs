import api from "../api";
const listTeam = async (req) => {
  let apiResponse;
  if (req && req.searchString) {
    apiResponse = await api.get(
      `/team-search/${req.searchString}?pageNo=${req.page}&size=${req.rows}`
    );
  } else {
    apiResponse = await api.get(
      `/team-search?pageNo=${req.page}&size=${req.rows}`
    );
  }
  let teamArray = apiResponse.data.teamArray;
  let returnArray = [];
  for (var i = 0; i < teamArray.length; i++) {
    returnArray.push({
      teamID: teamArray[i].teanID,
      teamAvatar: teamArray[i].teamAvatar,
      teamEmail: teamArray[i].teamEmail,
      teamName: teamArray[i].teamName,
      teamMembers: teamArray[i].teamMembers,
      gioiThieu: teamArray[i].gioiThieu,
      loaiTeam: teamArray[i].loaiTeam,
      deletedAt: teamArray[i].deletedAt,
    });
  }
  return { returnArray, total: returnArray.length };
};

export default listTeam;
