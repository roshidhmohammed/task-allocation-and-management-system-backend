import mongoose from "mongoose";
import Task from "../models/task.js";
import TaskAllocation from "../models/taskAllocation.js";
import User from "../models/user.js";

export const assignUser = async (req, res, next) => {
  try {
    const { userId, taskId } = req.body;
    const task = await Task.findById(new mongoose.Types.ObjectId(taskId));

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },

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
                      $eq: ["$assignedUser", "$userId"],
                    },
                    {
                      $in: ["$status", ["Pending", "In Progress"]],
                    },
                  ],
                },
              },
            },
          ],
          as: "activeTasks",
        },
      },

      {
        $addFields: {
          currentWorkLoad: {
            $sum: "$activeTasks.estimatedHours",
          },

          matchedSkills: {
            $size: {
              $setIntersection: ["$skills", task.requiredSkills],
            },
          },
        },
      },
      {
        $project: {
          fullName: 1,
          skills: 1,
          avaialableWorkingHours: 1,
          workingDays: 1,
          currentWorkLoad: 1,
          matchedSkills: 1,
        },
      },
    ]);

    const assignedUser = user[0];
    let reason = null;

    // skills check
    if (assignUser.matchedSkills !== task.requiredSkills.length) {
      reason = "Required skills do not match";
    }

    // availability check
    if (!reason && assignUser.avaialableWorkingHours <= 0) {
      reason = "User is unavailable";
    }

    // Existing workload check
    const freehours =
      assignUser.avaialableWorkingHours - assignUser.currentWorkLoad;
    if (!reason && freeHours < task.estimatedHours) {
      reason = "Insufficient available hours";
    }

    // due date check
    const daysRemaining = Math.ceil(
      (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
    );
    const possibleHours = daysRemaining * assignUser.avaialableWorkingHours;
    if (!reason && possibleHours < task.estimatedHours) {
      reason = "Due date cannot be met";
    }

    // priority check
    if (
      !reason &&
      task.priority === "High" &&
      freehours < task.estimatedHours
    ) {
      reason = "High priority task requires more capacity";
    }

    const allocateTask = await TaskAllocation.create({
      taskId,
      assignedUserId: userId,
      isSuccess: !reason,
      reason,
    });

    if (!reason) {
      const updateTask = await Task.findByIdAndUpdate(taskId, {
        assignedUser: userId,
      });
    }
    res.status(201).json({
      success: !reason,
      message: reason,
      data: allocateTask,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllAllocatedTasks = async (req, res, next) => {
  try {
    const allocatedTasks = await Task.find({
      assignedUser: {
        $exists: true,
      },
    }).sort({createdAt:-1})

    console.log(allocatedTasks)
    res.status(200).json({
      success: true,
      message: "allocated task fetched",
      data: allocatedTasks,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllNotAllocatedTasks = async (req, res, next) => {
  try {
    const notAllocatedTasks = await Task.find({
      assignedUser: {
        $exists: false,
      },
    }).sort({createdAt:-1});


    res.status(200).json({
      success: true,
      message: "not allocated task fetched",
      data: notAllocatedTasks,
    });
  } catch (error) {
    return next(error);
  }
};

export const allTaskAllocationTransactions = async (req, res, next) => {
  try {
const taskAllocations = await TaskAllocation.aggregate([
  {
    $lookup: {
      from: "tasks",
      localField: "taskId",
      foreignField: "_id",
      as: "task",
    },
  },
  {
    $unwind: "$task",
  },

  {
    $lookup: {
      from: "users",
      localField: "assignedUserId",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $unwind: "$user",
  },

  {
    $project: {
      _id: 1,

      allocationId: "$_id",

      taskId: "$task._id",
      title: "$task.title",
      description: "$task.description",
      status: "$task.status",
      priority: "$task.priority",
      estimatedHours: "$task.estimatedHours",
      dueDate: "$task.dueDate",
      requiredSkills: "$task.requiredSkills",

      userId: "$user._id",
      fullName: "$user.fullName",
      email: "$user.email",
      skills: "$user.skills",
      avaialableWorkingHours:
        "$user.avaialableWorkingHours",
      workingDays: "$user.workingDays",

      status: {
      $cond: {
        if: "$isSuccess",
        then: "Success",
        else: "Failed"
      }
    },
      reason: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
]);


    res.status(200).json({
      success: true,
      message: "not allocated task fetched",
      data: taskAllocations,
    });
  } catch (error) {
    return next(error);
  }
};


