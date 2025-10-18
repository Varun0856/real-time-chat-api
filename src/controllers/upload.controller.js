import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const uploadImage = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;
    if(!imageLocalPath) {
        throw new ApiError(400, 'Image file is required');
    }

    const image = await uploadOnCloudinary(imageLocalPath);

    res.status(201).json(
        new ApiResponse(201, image.url, "Image url generated successfully")
    );
})

export {uploadImage};
