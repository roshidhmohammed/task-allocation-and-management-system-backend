import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import errorHandler from "./middlewares/errorHandler.js";
import userRouter from "./routes/user.js";
import taskRouter from "./routes/task.js";
import taskAllocationRouter from "./routes/taskAllocation.js";

const app = express()

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json({limit:"10mb"}))

app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/task", taskRouter)
app.use("/api/task-allocation", taskAllocationRouter)

app.use(errorHandler)

export default app;