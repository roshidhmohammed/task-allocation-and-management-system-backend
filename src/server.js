import express from "express";
import dotenv from "dotenv";
import path from "path";

import app from "./app.js";
import connectDatabase from "./config/database.js";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development"

dotenv.config({path:path.join(process.cwd(), envFile)})

const port = process.env.PORT

app.listen(port, async()=>{
    try {
        await connectDatabase()
        console.log(`the server is running on port no ${port}`)
        
    } catch (error) {
        console.log("Failed to satrt the server", error)
        process.exit(1)
    }
})