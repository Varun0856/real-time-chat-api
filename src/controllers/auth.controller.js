import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtils.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, firstname, lastname, email, password, avatarUrl} = req.body;
    if([username, firstname, lastname, email, password].some((fields) => {
        return !fields || fields?.trim() === "";
    })) {
        throw new ApiError(400, "The required fields must be filled");
    }
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    });
    if(existingUser){
        throw new ApiError(400, "User with username or email already exists")
    }

    // password is hashed using the pre-save hook of database
    const newUser = await User.create({
        username, 
        firstname,
        lastname,
        email,
        password,
        isOnline: false,
        avatarUrl
    });

    const safeUser = newUser.toObject();
    delete safeUser.password;

    if(!newUser){
        throw new ApiError(500, "Something went wrong, please try again later!")
    }

    res.status(201).json(
        new ApiResponse(201, safeUser, "User registered successfully")
    );
})

const loginUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if(!(username || email)){
        throw new ApiError(400, "username or email is required");
    }
    const user = await User.findOne({
        $or: [{username}, {email}]
    }).select("+password");

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPassword = user.isPasswordCorrect(password);

    if(!isPassword){
        throw new ApiError(401,"Invalid credentials")
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false});

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.refreshToken;

    res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: false })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
        .json(new ApiResponse(200, {user: safeUser, accessToken}, "Login Successful"));
})

export {registerUser, loginUser};