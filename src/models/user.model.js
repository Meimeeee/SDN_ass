const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: "",
        },

        password: {
            type: String,
            required: true,
        },

        admin: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Mã hóa password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// So sánh password khi login
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);

