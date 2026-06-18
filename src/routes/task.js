import  express from "express"
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js"
import { create, getAll, getAllByStatus, remove, update } from "../controllers/task.js"
import isUserAuthenticated from "../middlewares/userAuth.js"
const taskRouter =  express.Router()


taskRouter.post("/", isUserAuthenticated, catchAsyncErrors(create))
taskRouter.put("/:taskId", isUserAuthenticated, catchAsyncErrors(update))
taskRouter.delete("/:taskId", isUserAuthenticated, catchAsyncErrors(remove))
taskRouter.get("/", isUserAuthenticated, catchAsyncErrors(getAll))
taskRouter.get("/categorized-by-status", isUserAuthenticated,  catchAsyncErrors(getAllByStatus))


export default taskRouter