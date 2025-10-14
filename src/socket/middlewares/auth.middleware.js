import { ApiError } from "../../utils/ApiError.js";
import { verifyAccessToken } from "../../utils/tokenUtils.js";

const authMiddleware = (socket, next) => {
    const token  = socket.handshake.auth.token;
    if(!token) {
        throw new ApiError(401, "No token found")
    }

    try {
        const decoded = verifyAccessToken(token);
        socket.user = decoded;
        next()
    } catch (error) {
        logger.error(`JWT verification failed: ${error.message}`);
        next(new ApiError(401, "Invalid token"))
    }
};

export {authMiddleware};