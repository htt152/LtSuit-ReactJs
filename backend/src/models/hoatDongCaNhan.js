const mongoose = require("mongoose");

const hoatDongCaNhanSchema = new mongoose.Schema(
  {
    loaiHoatDong: {
      type: String,
      required: true
    },
    moTaHoatDong: {
      type: String,
      required: true
    },
    diemHoatDong:{
        type: Number,
        required: true
    },
    deleteAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

hoatDongCaNhanSchema.methods.toJSON = function() {
  const hoatDongCaNhanObject = this.toObject();
  return hoatDongCaNhanObject;
};

const HoatDongCaNhan = mongoose.model("HoatDongCaNhan", hoatDongCaNhanSchema);

module.exports = HoatDongCaNhan;
