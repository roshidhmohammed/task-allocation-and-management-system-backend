import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name must be atleast 3 char"],
      maxLength: [30, "Name can't be exceed 30 char"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    skills: {
      type: [String],
      default: [],
    //   validate: {
    //     validator(value) {
    //       if (value === null) return true;
    //       return (
    //         Array.isArray(value) &&
    //         value.length > 0 &&
    //         value.every(
    //           (skill) => typeof skill === "string" && skill.trim().length >= 2,
    //         )
    //       );
    //     },
    //     message: "Skills must be a non-empty and valid",
    //   },
    },
    avaialableWorkingHours: {
      type: Number,
      default:0,
      min: [0, "Working hours must be greater than or equal to 0"],
      max: [24, "Working hours cannot exceed 24"],
    //   validate: {
    //     validator: Number.isInteger,
    //     message: "Please enter the valid hours",
    //   },
    },
    workingDays: {
      type: [String],
    //   validate: {
    //     validator(value) {
    //       if (value === null) return true;
    //       const validDays = ["mon", "tue", "wed", "thu", "fri"];

    //       return (
    //         Array.isArray(value) &&
    //         value.length > 0 &&
    //         value.every((day) => validDays.includes(day.toLowerCase()))
    //       );
    //     },
    //     message: "Working days must be mon, tue, wed, thu, fri",
    //   },
    },
  },
  { timestamps: true },
);

userSchema.index({ skills: 1, avaialableWorkingHours: 1 });


userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    return false;
  }
};

userSchema.methods.getJwt = function () {
  return jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    (delete ret.password, delete ret.__v);
  },
});

const User = mongoose.model("User", userSchema);
export default User;
