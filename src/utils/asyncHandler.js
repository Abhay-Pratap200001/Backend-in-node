const asyncHandler = (requestHandler) => {
     return (req, res, next) => {
     Promise.resolve(requestHandler(req, res, next))
    .catch((error) =>  next(error));
  };
};


export { asyncHandler };




// const asyucHandler = (fn) => async(req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//       res.status(err.code || 500).json({
//         success: false,
//         message: error.message
//       })
//     }
// }


