const mongoose = require("mongoose");
const validator = require("validator");

const teamSchema = new mongoose.Schema(
  {
    teamID: {
      type: mongoose.Schema.Types.ObjectId
    },
    teamName: {
      type: String,
      trim: true,
      required: true
    },
    teamAvatar: {
      type: Buffer
    },
    teamMembers: [
      {
        userEmail: {
          type: String
        },
        userName: {
          type: String
        }
      }
    ],
    teamEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      }
    },
    loaiTeam:{
      type: String
    },
    gioiThieu:{
      type: String
    },
    deleteAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

teamSchema.methods.toJSON = function() {
  const teamObject = this.toObject();
  return teamObject;
};

teamSchema.statics.findByCredentials = async teamName => {
  const team = await Team.findOne({ teamName });
  const error = [];

  if (!team) {
    error.push("Team not found!");
    return error;
  }
  return team;
};

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
