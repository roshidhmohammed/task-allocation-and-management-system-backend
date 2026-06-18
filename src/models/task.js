import mongoose from "mongoose";
import validator from "validator";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name must be atleast 3 char"],
      maxLength: [30, "Name can't be exceed 30 char"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name must be atleast 3 char"],
      maxLength: [200, "Name can't be exceed 200 char"]
    },
    status: {
      type: String,
      required: true,
      enum:["Pending", "In Progress", "Completed"],
      default:"Pending",
      validate: {
        validator(value) {
            const validStatus =["Pending", "In Progress", "Completed"]
            return (
               validStatus.includes(value)
            )
        },
        message: "Status must be Pending, In Progress, Completed"
      }
    },
      priority: {
      type: String,
      required: true,
      required:true,
      enum:["High", "Medium", "Low"],
      validate: {
        validator(value) {
            const validPriorities =["High", "Medium", "Low"]
            return (
             validPriorities.includes(value)
            )
        },
        message: "Status must be High, Medium, Low"
      }
    },
    requiredSkills: {
      type: [String],
      default: [],
      required:true,
      validate: {
        validator(value) {
          return (
            Array.isArray(value) &&
            value.length > 0 &&
            value.every(
              (skill) => typeof skill === "string" && skill.trim().length >= 2,
            )
          );
        },
        message: "Skills must be non-empty and valid",
      },
    },
    estimatedHours: {
      type: Number,
      required:true,
      min: [1, "Estimated hours must be greater than 0"],
      max: [24, "Estimated hours cannot exceed 24"],
      validate: {
        validator: Number.isInteger,
        message: "Please enter the valid hours",
      },
    },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    dueDate: {
        type: Date,
        required:true,
        validate: {
            validator(value) {
                return value > new Date();
            },
            message: "Due Date must be the after the today date"
        }
    }
  },
  { timestamps: true },
);

taskSchema.index({
    assignedUser:1,
    status:1,
    dueDate:1,
    createdAt:-1,
    priority:1
})

taskSchema.index({
    title:"text"
})


const Task = mongoose.model("Task", taskSchema);
export default Task;
