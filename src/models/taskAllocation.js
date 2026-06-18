import mongoose from "mongoose";
import validator from "validator";

const taskAlloationSchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required:true
    },
    assignedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    isSuccess:{
        type: Boolean,
        required:true,
        default:true
    },
    reason:{
        type: String,
        default: null,
        trim:true,
        min: [3, "please provide teh valid reason"]
    }
  },
  { timestamps: true },
);

taskAlloationSchema.index({
    taskId:1,
    assignedUserId:1
})


const TaskAllocation = mongoose.model("TaskAllocation", taskAlloationSchema);
export default TaskAllocation;
