const asyncHandler = (functionHandler) => {
    ( req, res, next ) => {
        Promise.resolve(functionHandler(req, res, next)).catch((error) => next(error))
    }
}


export { asyncHandler }





/*
// const asyncHandler = (funct) => {
//     () => {}
// } we can also write this as given below 

const asyncHandler = (func) => async (req,res,next) => {
    try {
        await func(req,res,next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/