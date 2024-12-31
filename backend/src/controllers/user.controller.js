import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utils/ApiResponse.js'

const registerUser = asyncHandler( async (req, res) => {
    /* 
        Steps: 
          1. Get the details from the frontend
          2. Validation - not empty
          3. Check if user already exists using username and email
          4. Check for images, also Avatar
          5. Upload them to cloudinary, check avatar once more
          6. Create user object - create entry in db
          7. Remove password, refresh token field from response
          8. check for user creation 
          9. return response if user created or error
    */

    const {username, fullName, email, password,  } = req.body
    console.log("email",email);

    // we can also check all the field one by one
    if (fullName === ''){
        throw new ApiError(400,"fullname is required")
    }

    // or we can use this to check all using a single if 
    if(
        [fullName, username, email, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,`All fields are required`)
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409,"User with email or username already exist")
    }



    // const avatarLocalPath = req.files?.avatar[0]?.path 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let avatarLocalPath;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length>0){
        avatarLocalPath = req.files?.avatar[0]?.path 
    }

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0 ) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is required")
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

export { registerUser }