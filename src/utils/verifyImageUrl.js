import { CLOUDINARY_CLOUD_NAME } from "../config/env.js";

const isValidCloudinaryUrl = async(cloudinaryUrl) => {
    try {
    const CLOUDINARY_BASE = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`;
    return (
      typeof url === "string" &&
      cloudinaryUrl.startsWith(CLOUDINARY_BASE) &&
      /\.(png|jpe?g|webp|gif|svg)$/.test(url)
    );
  } catch {
    return false;
  }
}

export default isValidCloudinaryUrl;