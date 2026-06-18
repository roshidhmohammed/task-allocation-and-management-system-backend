import  express from "express"
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js"
import { assignUser, getAllAllocatedTasks, getAllNotAllocatedTasks, allTaskAllocationTransactions } from "../controllers/taskAllocation.js"
import isUserAuthenticated from "../middlewares/userAuth.js"
const taskAllocationRouter =  express.Router()


taskAllocationRouter.post("/", isUserAuthenticated, catchAsyncErrors(assignUser))
taskAllocationRouter.get("/allocated-tasks", isUserAuthenticated, catchAsyncErrors(getAllAllocatedTasks))
taskAllocationRouter.get("/not-allocated-tasks", isUserAuthenticated,  catchAsyncErrors(getAllNotAllocatedTasks))
taskAllocationRouter.get("/all", isUserAuthenticated, allTaskAllocationTransactions)

export default taskAllocationRouter