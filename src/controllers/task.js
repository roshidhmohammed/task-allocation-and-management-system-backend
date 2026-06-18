import Task from "../models/task.js";

export const create = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      estimatedHours,
      dueDate,
      requiredSkills,
    } = req.body;

    const newTask = {
      title,
      description,
      status,
      priority,
      estimatedHours,
      dueDate,
      requiredSkills,
    };

    const createTask = await Task.create(newTask);
    if (!createTask) {
      return next(new AppError("Cannot create a task", 409));
    }

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: createTask,
    });
  } catch (error) {
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const updateTask = await Task.findByIdAndUpdate(taskId, req.body);
    if (!updateTask) {
      return next(new AppError("Cannot update this task", 409));
    }
    res.status(201).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return next(new AppError("Cannot create a task", 404));
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { pageNo, limit = 10, search, status, priority } = req.query;
    const skip = (pageNo - 1) * limit;

    const query = {};
    if (search !== "") {
      query.$text = {
        $search: search,
      };
    }

    if (priority !== "") {
      query.priority = priority;
    }

    if (status !== "") {
      query.status = status;
    }
    const allTask = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalDocumentsCount = await Task.countDocuments(query);

    if (!allTask) {
      return next(new AppError("Please try after sometime", 409));
    }
    res.status(200).json({
      success: true,
      message: "tasks fecthed successfully",
      data: allTask,
      totalCount: totalDocumentsCount,
    });
  } catch (error) {
    return next(error);
  }
};

export const getAllByStatus = async (req, res, next) => {
  try {
    const tasks = await Task.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
            },
          },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$status", "Pending"] }, 1, 0],
            },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
          completed: 1,
          pending: 1,
          inProgress: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "tasks fecthed successfully",
      data: tasks,
    });
  } catch (error) {
    return next(error);
  }
};
