import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccesAndRefereshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accesToken = user.generateAccessToken()
        const refereshToken = user.generateRefreshToken()

        user.refereshToken = refereshToken
       await user.save({ validateBeforeSave: false })

       return {accesToken, refereshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler( async (req, res)=>{
    res.status(200).json({
        message: "ok"
    });
});

const loginUser = asyncHandler(async (req, res) =>{
    //HOW TO WRITE LOGIN CONTROLLER
    //1. Take data from --> req.body
    //2. Type of access username or email
    //3. find the user is user is exist or not
    //4. check the password if pass word is correct
    //5. give user access and refresh token
    //6. send token in cookie
    //7. send response that sucessfully login

    const  {emil, username, password} = req.body

    if (!username || !emil) {
        throw new ApiError(400, "username or password is required");
    }

    const user = await User.findOne({
        $or: [{username}, {emil}]
    });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid =  await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentical");
    }

    const {accesToken, refereshToken} = await generateAccesAndRefereshToken(user._id)

   const loggedInUser = User.find(user._id).
   select ("-password -refreshToken")

   const options = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .cookie("accessToken", accesToken, options)
   .cookie("refreshToken", refereshToken, options)
   .json(
    new ApiResponse(
        200,
        {
           user: loggedInUser, accesToken, refereshToken 
        },
        "User logged In Successfully"
    )
   )

})

const logoutUser = asyncHandler(async(req, res) =>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $set: {
            refereshToken: undefined
        }
    },
    {
        new: true
    }
   )

   const options = {
    httpOnly: true,
    secure: true
   }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))

})



export {registerUser, loginUser, logoutUser}