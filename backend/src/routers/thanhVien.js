const express = require("express");
const User = require("../models/user");
const Team = require("../models/team");
const router = new express.Router();

const userReturnValue = {
  _id: 1,
  avatar: 1,
  name: 1,
  email: 1,
  kyNang: 1,
  teams: 1,
  role: 1,
};
const teamReturnValue = {
  _id: 1,
  teamAvatar: 1,
  teamName: 1,
  teamEmail: 1,
  teamRole: 1,
  teamMembers: 1,
  deletedAt: 1,
  gioiThieu: 1,
  loaiTeam: 1,
};

const searchUser = async (searchString) => {
  let userValue;
  if (!searchString) {
    userValue = await User.find({}, userReturnValue);
  } else {
    userValue = await User.find(
      { name: new RegExp(searchString, "i") },
      userReturnValue
    );
  }
  let returnObject = {
    userArray: [],
  };
  for (var i = 0; i < userValue.length; i++) {
    returnObject.userArray.push({
      userID: userValue[i]._id,
      userAvatar: userValue[i].avatar,
      userEmail: userValue[i].email,
      userName: userValue[i].name,
      teams: userValue[i].teams,
      kyNang: userValue[i].kyNang,
      role: userValue[i].role,
    });
  }
  return returnObject;
};

const searchTeam = async (searchString, resPerPage, page) => {
  let teamValue;
  if (!searchString) {
    teamValue = await Team.find({}, teamReturnValue)
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);
  } else {
    teamValue = await Team.find(
      { teamName: new RegExp(searchString, "i") },
      teamReturnValue
    )
      .skip(resPerPage * page - resPerPage)
      .limit(resPerPage);
  }
  let returnObject = {
    teamArray: [],
  };
  for (var i = 0; i < teamValue.length; i++) {
    returnObject.teamArray.push({
      teanID: teamValue[i]._id,
      teamAvatar: teamValue[i].teamAvatar,
      teamEmail: teamValue[i].teamEmail,
      teamName: teamValue[i].teamName,
      teamMembers: teamValue[i].teamMembers,
      loaiTeam: teamValue[i].loaiTeam,
      gioiThieu: teamValue[i].gioiThieu,
      deletedAt: teamValue[i].deletedAt,
    });
  }
  return returnObject;
};

router.get("/thanhvien-search/:searchString", async (req, res) => {
  try {
    let returnObject = await searchUser(req.params.searchString);
    return res.status(200).send(returnObject);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/thanhvien-search/", async (req, res) => {
  try {
    let returnObject = await searchUser();
    return res.status(200).send(returnObject);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/team-search/:searchString", async (req, res) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let size = parseInt(req.query.size) || 10;
    let returnObject = await searchTeam(req.params.searchString, size, pageNo);
    return res.status(200).send(returnObject);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/team-search/", async (req, res) => {
  try {
    let pageNo = parseInt(req.query.pageNo) || 1;
    let size = parseInt(req.query.size) || 10;
    let returnObject = await searchTeam(null, size, pageNo);
    return res.status(200).send(returnObject);
  } catch (e) {
    return res.status(400).send(e);
  }
});

let returnValueUser = {
  _id: "",
  avatar: "",
  email: "",
  name: "",
  teams: [],
  kyNang: "",
  role: "",
};

let returnValueTeam = {
  teamID: "",
  teamAvatar: "",
  teamEmail: "",
  teamName: "",
  teamMembers: [],
  gioiThieu: "",
  loaiTeam: "",
  deletedAt: "",
};

const returnUserValue = (findValue) => {
  returnValueUser._id = findValue._id;
  returnValueUser.avatar = findValue.avatar;
  returnValueUser.email = findValue.email;
  returnValueUser.name = findValue.name;
  returnValueUser.teams = findValue.teams;
  returnValueUser.kyNang = findValue.kyNang;
  returnValueUser.role = findValue.role;
  return returnValueUser;
};

const returnTeamValue = (findValue) => {
  returnValueTeam._id = findValue._id;
  returnValueTeam.teamAvatar = findValue.teamAvatar;
  returnValueTeam.teamEmail = findValue.teamEmail;
  returnValueTeam.teamName = findValue.teamName;
  returnValueTeam.teamMembers = findValue.teamMembers;
  returnValueTeam.loaiTeam = findValue.loaiTeam;
  returnValueTeam.gioiThieu = findValue.gioiThieu;
  returnValueTeam.deletedAt = findValue.deletedAt;
  return returnValueTeam;
};

router.get("/profile/:searchID", async (req, res) => {
  try {
    let findValue = await User.findById(
      { _id: req.params.searchID },
      userReturnValue
    );
    if (findValue === null) {
      return res.status(400).send("ID khong ton tai");
    } else {
      return res.status(200).send(returnUserValue(findValue));
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/profile/", async (req, res) => {
  try {
    let findValue = await User.findOne(
      { email: req.body.email },
      userReturnValue
    );
    if (findValue === null) {
      return res.status(400).send("email khong ton tai");
    } else {
      return res.status(200).send(returnUserValue(findValue));
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/teamProfile/:searchID", async (req, res) => {
  try {
    let findValue = await Team.findById(
      { _id: req.params.searchID },
      teamReturnValue
    );
    if (findValue === null) {
      return res.status(400).send("ID khong ton tai");
    } else {
      return res.status(200).send(returnTeamValue(findValue));
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/teamListLength", async (req, res) => {
  try {
    let response = await Team.countDocuments();
    return res.status(200).send(response.toString());
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/teamListLength/:searchString", async (req, res) => {
  try {
    let response = await Team.find(
      { teamName: new RegExp(req.params.searchString, "i") },
      teamReturnValue
    );
    if (response) {
      return res.status(200).send(response.length.toString());
    } else {
      return res.status(200).send("0");
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

module.exports = router;
