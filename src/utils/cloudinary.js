import { v2 as cloudinary} from "cloudinary";
import fs from 'fs'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../config/env.js";
import { ApiError } from "./ApiError.js";
import logger from "./winstonLogger.js";

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) throw new ApiError(400, "Local file path is required for upload");
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        logger.info(`File has been uploaded on cloudinary ${response.url}`);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw error instanceof ApiError ? error : new ApiError(500, "Cloudinary upload failed", error);
    }
}

export {uploadOnCloudinary};