import AppError from "../middlewares/appError.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import {
  availableWorkingHoursSchema,
  skillsSchema,
  workingDaysSchema,
} from "../utils/inputValidation.js";

export const register = async (req, res, next) => {
  try {
    const { fullName, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      fullName,
      email,
      password: hashedPassword,
    };

    const createdUser = await User.create(newUser);

    if (!createdUser) {
      return next(
        new AppError("Cannot create an account with this user info", 204),
      );
    }

    res.status(201).json({
      success: true,
      message: "User registered",
      data: createdUser,
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loggedinUser = await User.findOne({ email: email });
    if (!loggedinUser) {
      return next(new AppError("User not found", 404));
    }

    const isPasswordValid = loggedinUser.comparePassword(password);
    if (!isPasswordValid) {
      return next(new AppError("Password is incorrect", 401));
    }
    const token = loggedinUser.getJwt();
    const exp = process.env.COOKIES_EXP_TIME;

    res.cookie("token", token, {
      expires: new Date(Date.now() + 24 * 3600000),
    });
    res.status(200).json({
      success: true,
      message: "Login successfull",
    });
  } catch (error) {
    return next(error);
  }
};

export const checkUserAuthentication = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new AppError("Please login", 401));
    }

    res.status(200).json({
      success: true,
      message: "successfully verified user auth",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const workload = async (req, res, next) => {
  try {
    const usersWorkload = await User.aggregate([
      {
        $lookup: {
          from: "tasks",
          let: {
            userId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$assignedUser", "$$userId"],
                    },
                    {
                      $in: ["$status", ["Pending", "In Progress"]],
                    },
                  ],
                },
              },
            },
          ],
          as: "assignedTasks",
        },
      },

      {
        $addFields: {
          allocatedHours: {
            $sum: "$assignedTasks.estimatedHours",
          },
        },
      },

      {
        $addFields: {
          remainingCapacity: {
            $subtract: ["$avaialableWorkingHours", "$allocatedHours"],
          },
        },
      },

      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          avaialableWorkingHours: 1,
          allocatedHours: 1,
          remainingCapacity: 1,
        },
      },

      {
        $sort: {
          remainingCapacity: -1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      message: "successfully fetched the users workload",
      data: usersWorkload,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    const user = req.user;
    if (!skillsSchema(skills)) {
      return next(new AppError("Please enter the valid skills", 409));
    }

    const updateUserSkill = await User.findByIdAndUpdate(
      user._id,
      {
        $addToSet: {
          skills: {
            $each: skills,
          },
        },
      },
      { new: true },
    );
    res.status(201).json({
      success: true,
      message: "successfully updated the skills",
      data: updateUserSkill,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateAvailableHoursPerDay = async (req, res, next) => {
  try {
    const { availableWorkingHours } = req.body;
    const user = req.user;
    if (!availableWorkingHoursSchema(availableWorkingHours)) {
      return next(new AppError("Please enter the valid workiing hours", 409));
    }

    const updateUserAvailableHoursPerDay = await User.findByIdAndUpdate(
      user._id,
      { avaialableWorkingHours: availableWorkingHours },
      { new: true },
    );
    if (!updateUserAvailableHoursPerDay) {
      return next(new AppError("Please enter the valid workiing hours", 409));
    }
    res.status(201).json({
      success: true,
      message: "successfully updated the working hours",
      data: updateUserAvailableHoursPerDay,
    });
  } catch (error) {
    return next(error);
  }
};

export const updateWorkingDays = async (req, res, next) => {
  try {
    const { workingDays } = req.body;
    const user = req.user;
    if (!workingDaysSchema(workingDays)) {
      return next(new AppError("Please enter the valid working days", 409));
    }

    const updateUserWorkingDays = await User.findByIdAndUpdate(user?._id, {
      $addToSet: {
        workingDays: {
          $each: workingDays,
        },
      },
    });

    if (!updateUserWorkingDays) {
      return next(new AppError("Please enter the valid working days", 409));
    }
    res.status(201).json({
      success: true,
      message: "successfully updated the working days",
      data: updateUserWorkingDays,
    });
  } catch (error) {
    return next(error);
  }
};

export const allUser = async (req, res, next) => {
  try {
    const user = req.user;
    const users = await User.find({
      _id: {
        $ne: user._id,
      },
    });
    res.status(201).json({
      success: true,
      message: "user list fetched successfully",
      data: users,
    });
  } catch (error) {
    return next(error);
  }
};
