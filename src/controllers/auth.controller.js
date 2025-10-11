import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/tokenUtils.js";
import { NODE_ENV } from "../config/env.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.headers["x-refresh-token"];

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token missing");
    }

    let decodedToken;
    try {
        decodedToken = verifyRefreshToken(incomingRefreshToken);
    } catch (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken.userId).select("+refreshToken");
    if(!user) throw new ApiError(404, "User not found");

    if(user.refreshToken !== incomingRefreshToken)
        throw new ApiError(403, "Token mismatch or reused refresh token");

    const newAccessToken = generateAccessToken(user._id);

    res.status(200).cookie("accessToken", newAccessToken, { httpOnly: true, secure: NODE_ENV === "production" }).json(
        new ApiResponse(200, {accessToken: newAccessToken}, "Access token refreshed successfully")
    )
});

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

    const isPassword = await user.isPasswordCorrect(password);

    if(!isPassword){
        throw new ApiError(401,"Invalid credentials")
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isOnline = true;
    await user.save({ validateBeforeSave: false});

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.refreshToken;

    res
        .status(200)
        .cookie("accessToken", accessToken, { httpOnly: true, secure: NODE_ENV === "production" })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: NODE_ENV === "production" })
        .json(new ApiResponse(200, {user: safeUser, accessToken}, "Login Successful"));
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
                isOnline: false
            }
        },
        {
            new: true
        }
    )
    return res.status(200).clearCookie("accessToken", {
        httpOnly: true, secure: NODE_ENV === "production"
    }).clearCookie("refreshToken", {
        httpOnly: true, secure: NODE_ENV === "production"
    }).json(
        new ApiResponse(200, {}, "User logged out successfully")
    );
})

export {refreshAccessToken,registerUser, loginUser, logoutUser};