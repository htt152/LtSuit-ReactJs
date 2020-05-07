const mongoose = require("mongoose");

const bangdiemSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true
    },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      trim: true,
      required: true
    },
    learningPoints: {
      type: Number
    },
    basedPoints: {
      type: Number
    },
    danhSach: [
      {
        hoatDongID: {
          type: String,
          require: true
        },
        title: {
          type: String,
          require: true
        },
        type: {
          type: String,
          require: true
        },
        date: {
          type: String,
          require: true
        },
        description: {
          type: String,
          require: true
        },
        status: {
          type: String,
          require: true
        },
        point: {
          type: Number,
          require: true
        }
      }
    ],
    deleteAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

bangdiemSchema.methods.toJSON = function() {
  const diemhoctapObject = this.toObject();
  return diemhoctapObject;
};

const BangDiem = mongoose.model("Bangdiem", bangdiemSchema);

module.exports = BangDiem;
