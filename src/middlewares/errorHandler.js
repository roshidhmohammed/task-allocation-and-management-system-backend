
function errorHandler(err,req, res, next) {
    if(err.code === 11000){
        const field = Object.keys(err.keyValue)[0]
        return res.status(409).json({
            success:false,
            status:"error",
            message:`${field} already exists`
        })
    }
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    res.status(statusCode).json({
        success:false,
        status: err.status || 'error',
        message
    }) 
}

export default errorHandler