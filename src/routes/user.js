import  express from "express"
import { checkUserAuthentication, login, register, updateAvailableHoursPerDay,allUser, updateSkills, updateWorkingDays, workload } from "../controllers/user.js"
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js"
import isUserAuthenticated from "../middlewares/userAuth.js"
const userRouter =  express.Router()


userRouter.get("/workload", isUserAuthenticated, catchAsyncErrors(workload))
userRouter.patch("/update-skills", isUserAuthenticated, catchAsyncErrors(updateSkills))
userRouter.patch("/update-available-hours", isUserAuthenticated, catchAsyncErrors(updateAvailableHoursPerDay))
userRouter.patch("/update-working-days", isUserAuthenticated, catchAsyncErrors(updateWorkingDays))
userRouter.get("/all", isUserAuthenticated, catchAsyncErrors(allUser))



export default userRouter