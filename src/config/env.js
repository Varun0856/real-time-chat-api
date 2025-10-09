import { config } from "dotenv";

config({
    path: `.env.${process.env.NODE_ENV || 'development'}.local`
})

export const {
    PORT,
    NODE_ENV,
    MONGODB_URI,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRY
} = process.env