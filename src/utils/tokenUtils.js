import jwt from "jsonwebtoken"
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../config/env.js"

export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    }); 
};

export const generateRefreshToken = (userId) => {
    return jwt.sign({userId}, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};

export const verifyAccessToken = (token) => {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

