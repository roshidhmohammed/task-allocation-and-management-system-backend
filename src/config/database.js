import mongoose from "mongoose"

async function connectDatabase(){
    try {
        if(mongoose.connection.readyState ===1){
            throw new Error("Error while connecting the db")
        }
       const connection =await  mongoose.connect(process.env.DATABASE_URL, {
        bufferCommands:false,
        serverSelectionTimeoutMS:10000
       })
       const data = await connection
       console.log("Database is connected")
    } catch (error) {
        console.log("Error while connecting", error)
        throw error
    }
}

export default connectDatabase