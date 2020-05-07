const express = require("express");
const HoatDongCaNhan = require("../models/hoatDongCaNhan");
const router = new express.Router();

router.get("/hoatdong", async (req, res) => {
  try {
    const hoatDongCaNhan = await HoatDongCaNhan.find();
    res.status(200).send(hoatDongCaNhan);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/hoatdong/create", async (req, res) => {
  try {
    const hoatDongCaNhan = new HoatDongCaNhan(req.body);
    await hoatDongCaNhan.save();
    return res.status(201).send(hoatDongCaNhan);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.get("/hoatdong/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const foundHoatDong = await HoatDongCaNhan.findOne({ _id: id });
    if (!foundHoatDong) {
      return res.status(200).send("Khong thay hoat dong nay");
    }
    res.status(200).send(foundHoatDong);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/hoatdong/:loaiHoatDong", async (req, res) => {
  try {
    const loaiHoatDong = req.params.loaiHoatDong;
    const foundHoatDong = await HoatDongCaNhan.findOne({
      loaiHoatDong: loaiHoatDong
    });
    if (!foundHoatDong) {
      return res.status(200).send("Khong thay hoat dong nay");
    }
    res.status(200).send(foundHoatDong);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
