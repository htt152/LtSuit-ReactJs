const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    roleID: {
      type: Number,
      require: true
    },
    roleName: {
      type: String,
      trim: true,
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

roleSchema.methods.toJSON = function() {
  const roleObject = this.toObject();
  return roleObject;
};

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
