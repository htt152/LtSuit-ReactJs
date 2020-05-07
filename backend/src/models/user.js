const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      minlength: 6,
      maxlength: 32,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a postive number!");
        }
      },
    },
    ngaySinh: {
      type: String,
    },
    gioiTinh: {
      type: String,
    },
    gioiThieu: {
      type: String,
      maxlength: 250,
    },
    phone: {
      type: String,
    },
    phanLoai: {
      type: String,
    },
    nghiepVu: {
      type: String,
    },
    kyNang: {
      type: String,
    },
    diaChi: {
      type: String,
      trim: true,
      maxlength: 250,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: String,
    },
    teams: [
      {
        teamID: {
          type: mongoose.Schema.Types.ObjectId,
        },
        teamName: {
          type: String,
        },
      },
    ],
    role: {
      type: Number,
      require: true,
    },
    deleteAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  // const token = jwt.sign({_id: user._id.toString(),exp: Math.floor(Date.now() / 1000) + 5  }, process.env.JWT_SECRET)
  // const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET,{ expiresIn: 120 })
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  // user.tokens = user.tokens.concat({token})
  user.tokens[0] = { token };
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  const error = [];

  if (!user) {
    error.push("Username or email not found!");
    return error;
    // throw new Error('Unable to login!')
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    error.push("Wrong password!");
    return error;
    // throw new Error('Unable to login!')
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
