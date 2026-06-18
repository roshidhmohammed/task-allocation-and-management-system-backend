import mongoose from "mongoose";
import Task from "../models/task.js";
import TaskAllocation from "../models/taskAllocation.js";
import User from "../models/user.js";
import { countWorkingDaysUntilDueDate } from "../utils/countWorkingDaysUntilDueDate .js";

export const assignUser = async (req, res, next) => {
  try {
    const { userId, taskId } = req.body;
    const task = await Task.findById(new mongoose.Types.ObjectId(taskId));
    const currentDate = new Date();
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
                      $eq: ["$assignedUser", "$$userId"],
                    },
                    {
                      $in: ["$status", ["Pending", "In Progress"]],
                    },
                    {
                      $gte: ["$dueDate", currentDate],
                    },
                    {
                      $lte: ["$dueDate", task.dueDate],
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
          matchedSkills: {
            $setIntersection: ["$skills", task.requiredSkills],
          },

          totalWorkload: {
            $sum: "$activeTasks.estimatedHours",
          },
        },
      },

      {
        $project: {
          fullName: 1,
          skills: 1,
          avaialableWorkingHours: 1,
          workingDays: 1,
          matchedSkills: 1,
          totalWorkload: 1,
        },
      },
    ]);


    const assignedUser = user[0];
    let reason = null;

    // skills check
    if (
      assignedUser.matchedSkills.length <= 0 ||
      assignedUser.skills.length <= 0 ||
      assignedUser.skills.length !== assignedUser.matchedSkills.length
    ) {
      reason = "Required skills do not match";
    }

    // availability and estimated task hours check
    const today = new Date();
    const noOfWorkingDays =countWorkingDaysUntilDueDate(task.dueDate, assignedUser.workingDays)
    const totalWorkHours = noOfWorkingDays * assignedUser.avaialableWorkingHours
    const freehours = totalWorkHours - assignedUser.totalWorkload
    if (!reason && freehours < task.estimatedHours) {
      reason = "User is unavailable";
    }

    if (!reason && new Date(task.dueDate) < new Date()) {
      reason = "Task due date has already passed";
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
      message: reason || "Successfully allocated task",
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
    }).sort({ createdAt: -1 });

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
    }).sort({ createdAt: -1 });

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
          avaialableWorkingHours: "$user.avaialableWorkingHours",
          workingDays: "$user.workingDays",

          status: {
            $cond: {
              if: "$isSuccess",
              then: "Success",
              else: "Failed",
            },
          },
          reason: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "task allocations fetched",
      data: taskAllocations,
    });
  } catch (error) {
    return next(error);
  }
};
