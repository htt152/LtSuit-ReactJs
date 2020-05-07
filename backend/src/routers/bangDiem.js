const express = require("express");
const BangDiem = require("../models/bangDiem");
const router = new express.Router();
const auth = require("../middleware/auth");
const BasePointCalculate = require("../utilities/BasePointCalculate");
const ObjectID = require("mongodb").ObjectID;
const HoatDongCaNhan = require("../models/hoatDongCaNhan");

const validateForm = async req => {
  let exitUser = await BangDiem.findOne({ userEmail: req.email });
  if (!exitUser) {
    return {
      isValid: false,
      errorMessage: "Khong ton tai user"
    };
  }
  if (
    req.title.replace(/ /g, "").length == 0 ||
    req.description.replace(/ /g, "").length == 0 ||
    req.date.replace(/ /g, "").length == 0 ||
    req.description.length >= 500 ||
    req.title.length >= 500
  ) {
    return {
      isValid: false,
      errorMessage: "Du lieu khong hop le"
    };
  }
  return {
    isValid: true
  };
};

const validate = async req => {
  if (
    req.hoatDongID.replace(/ /g, "").length == 0 ||
    req.title.replace(/ /g, "").length == 0 ||
    req.description.replace(/ /g, "").length == 0 ||
    req.date.replace(/ /g, "").length == 0
  ) {
    return {
      isValid: false,
      errorMessage: "Du lieu khong hop le"
    };
  }
  return {
    isValid: true
  };
};

router.get("/bangdiem", async (req, res) => {
  try {
    let returnArray = [];
    const bangdiem = await BangDiem.find();
    for (var i = 0; i < bangdiem.length; i++) {
      let userName = bangdiem[i].userName;
      let name = bangdiem[i].name;
      let learningPoint = 0;
      let basePoint = 0;
      for (let j = 0; j < bangdiem[i].danhSach.length; j++) {
        let point = bangdiem[i].danhSach[j].point;
        if (bangdiem[i].danhSach[j].status === "approved") {
          learningPoint += point;
        }
      }
      returnArray.push({
        userName,
        name,
        learningPoint,
        basePoint
      });
    }
    res.send(BasePointCalculate(returnArray));
  } catch (error) {
    res.send(error);
  }
});

router.get("/bangdiem/admin", auth, async (req, res) => {
  try {
    const bangdiem = await BangDiem.find();
    let returnBangDiem = {
      pending: [],
      approve: [],
      denied: []
    };
    if (bangdiem.length > 0) {
      for (let i = 0; i < bangdiem.length; i++) {
        let userName = bangdiem[i].userName;
        let email = bangdiem[i].userEmail;
        let name = bangdiem[i].name;
        for (let j = 0; j < bangdiem[i].danhSach.length; j++) {
          let id = bangdiem[i].danhSach[j]._id;
          let title = bangdiem[i].danhSach[j].title;
          let type = bangdiem[i].danhSach[j].type;
          let description = bangdiem[i].danhSach[j].description;
          let status = bangdiem[i].danhSach[j].status;
          let date = bangdiem[i].danhSach[j].date;
          let point = bangdiem[i].danhSach[j].point;
          let pushObject = {
            id,
            userName,
            email,
            name,
            title,
            type,
            description,
            status,
            date,
            point
          };
          if (status === "pending") {
            returnBangDiem.pending.push(pushObject);
          } else if (status === "approved") {
            returnBangDiem.approve.push(pushObject);
          } else {
            returnBangDiem.denied.push(pushObject);
          }
        }
      }
    }
    res.send(returnBangDiem);
  } catch (error) {
    res.send(error);
  }
});

router.post("/bangdiem/canhan", async (req, res) => {
  try {
    const bangdiem = await BangDiem.findOne({ userEmail: req.body.email });
    let returnBangDiem = {
      pending: [],
      approve: [],
      denied: []
    };
    if (!bangdiem) {
      return res.status(400).send({ error: "Bad request!" });
    }
    let userName = bangdiem.userName;
    let email = bangdiem.userEmail;
    let name = bangdiem.name;
    for (let j = 0; j < bangdiem.danhSach.length; j++) {
      let id = bangdiem.danhSach[j]._id;
      let title = bangdiem.danhSach[j].title;
      let type = bangdiem.danhSach[j].type;
      let description = bangdiem.danhSach[j].description;
      let status = bangdiem.danhSach[j].status;
      let date = bangdiem.danhSach[j].date;
      let point = bangdiem.danhSach[j].point;
      let pushObject = {
        id,
        userName,
        email,
        name,
        title,
        type,
        description,
        status,
        date,
        point
      };
      if (status === "pending") {
        returnBangDiem.pending.push(pushObject);
      } else if (status === "approved") {
        returnBangDiem.approve.push(pushObject);
      } else {
        returnBangDiem.denied.push(pushObject);
      }
    }
    res.send(returnBangDiem);
  } catch (error) {
    res.send(error);
  }
});

const getDanhSachDiem = async email => {
  const bangdiem = await BangDiem.findOne({ userEmail: email });
  if (bangdiem) {
    return bangdiem.danhSach;
  } else {
    return [];
  }
};

router.get("/bangdiem/:email", async (req, res) => {
  const email = req.params.email;

  try {
    const danhSachDiem = await getDanhSachDiem(email);
    return res.send(danhSachDiem);
  } catch (error) {
    res.send(error);
  }
});

router.patch("/bangdiem/change", async (req, res) => {
  try {
    let formVaidate = await validateForm(req.body.data);
    if (!formVaidate.isValid) {
      return res.status(400).send(formVaidate.errorMessage);
    }
    const data = req.body.data;
    let hoatDong;
    if (data.hoatDongID) {
      hoatDong = await HoatDongCaNhan.findOne({
        _id: ObjectID(data.hoatDongID)
      });
    } else if (data.type) {
      hoatDong = await HoatDongCaNhan.findOne({ loaiHoatDong: data.type });
    } else {
      return res.status(400).send("Dữ liệu không hợp lệ");
    }
    const diem = hoatDong.diemHoatDong;
    const mota = hoatDong.moTaHoatDong;
    const id = hoatDong._id;
    const hoatDongType = hoatDong.loaiHoatDong;
    let returnType = `${hoatDongType} - ${mota}`;
    const danhSachDiem = await getDanhSachDiem(data.email);
    if (danhSachDiem.length > 0) {
      for (var i = 0; i < danhSachDiem.length; i++) {
        if (danhSachDiem[i]._id.toString() === data._id.toString()) {
          danhSachDiem[i].title = data.title;
          danhSachDiem[i].type = returnType;
          danhSachDiem[i].description = data.description;
          danhSachDiem[i].hoatDongID = id;
          danhSachDiem[i].date = data.date;
          danhSachDiem[i].status = "pending";
          danhSachDiem[i].point = diem;
        }
      }
      let newData = { $set: { danhSach: danhSachDiem } };
      let querry = { userEmail: data.email };
      let response = await BangDiem.update(querry, newData);
      return res.status(200).send(response);
    } else {
      return res.status(400).send("No data found");
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.patch("/bangdiem/change-approved", async (req, res) => {
  try {
    const dataArray = req.body.data;
    let response;
    for (var i = 0; i < dataArray.length; i++) {
      let danhSachDiem = await getDanhSachDiem(dataArray[i].email);
      if (danhSachDiem.length > 0) {
        for (var j = 0; j < danhSachDiem.length; j++) {
          if (danhSachDiem[j]._id.toString() === dataArray[i].id.toString()) {
            danhSachDiem[j].status = "approved";
          }
        }
        let newData = { $set: { danhSach: danhSachDiem } };
        let querry = { userEmail: dataArray[i].email };
        response = await BangDiem.update(querry, newData);
      }
    }
    return res.status(200).send(response);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.patch("/bangdiem/change-denied", async (req, res) => {
  try {
    const dataArray = req.body.data;
    let response;
    for (var i = 0; i < dataArray.length; i++) {
      let danhSachDiem = await getDanhSachDiem(dataArray[i].email);
      if (danhSachDiem.length > 0) {
        for (var j = 0; j < danhSachDiem.length; j++) {
          if (danhSachDiem[j]._id.toString() === dataArray[i].id.toString()) {
            danhSachDiem[j].status = "denied";
          }
        }
        let newData = { $set: { danhSach: danhSachDiem } };
        let querry = { userEmail: dataArray[i].email };
        response = await BangDiem.update(querry, newData);
      }
    }
    return res.status(200).send(response);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post("/bangdiem/create", async (req, res) => {
  try {
    const danhsach = req.body.danhSach;
    let data = [];

    for (var i = 0; i < danhsach.length; i++) {
      const vaidate = await validate(danhsach[i]);
      if (!vaidate.isValid) {
        return res.status(400).send(vaidate.errorMessage);
      }
      const hoatdong = await HoatDongCaNhan.findOne({
        _id: danhsach[i].hoatDongID
      });
      if (!hoatdong) {
        return res.status(400).send({ error: "Không tìm thấy hoạt động !" });
      }
      const row = {
        hoatDongID: danhsach[i].hoatDongID,
        title: danhsach[i].title,
        type: hoatdong.loaiHoatDong + " - " + hoatdong.moTaHoatDong,
        date: danhsach[i].date,
        description: danhsach[i].description,
        status: "pending",
        point: hoatdong.diemHoatDong
      };
      data[i] = row;
    }

    const user = await BangDiem.findOne({ userEmail: req.body.userEmail });

    if (!user) {
      return res.status(400).send({ error: "Không tìm thấy email !!!" });
    } else {
      user.danhSach = user.danhSach.concat(data);
      await user.save();
    }
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/bangdiem/delete", async (req, res) => {
  try {
    let response = await BangDiem.updateOne(
      { userEmail: req.body.email },
      { $pull: { danhSach: { _id: ObjectID(req.body._id) } } }
    );
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
