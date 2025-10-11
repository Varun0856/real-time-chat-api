import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { verifyAccessToken } from "../utils/tokenUtils.js";

export const verifyJWT = asyncHandler(async (req, _,next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token) {
        throw new ApiError(401, "No token found");
    }
    const decodedToken = verifyAccessToken(token);

    if(!decodedToken?.userId){
        throw new ApiError(401, "Invalid or expired access token")
    }

    const user = await User.findById(decodedToken.userId).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401, "Unauthorized: Invalid access token");
    };

    req.user = user;
    next();
})