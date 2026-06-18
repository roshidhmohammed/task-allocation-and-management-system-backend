import  express from "express"
import { checkUserAuthentication, login, register, updateAvailableHoursPerDay,allUser, updateSkills, updateWorkingDays, workload } from "../controllers/user.js"
import catchAsyncErrors from "../middlewares/asyncCatchErrors.js"
import isUserAuthenticated from "../middlewares/userAuth.js"
const userAuthRouter =  express.Router()


userAuthRouter.post("/", catchAsyncErrors(register))
userAuthRouter.post("/login", catchAsyncErrors(login))
userAuthRouter.get("/check-user-auth", isUserAuthenticated, catchAsyncErrors(checkUserAuthentication))




export default userAuthRouter