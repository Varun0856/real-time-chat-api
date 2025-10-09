import mongoose from "mongoose";
import { MONGODB_URI } from "../config/env.js";
import logger from "../utils/winstonLogger.js";

if(!MONGODB_URI){
    throw new Error('Please declare MONGODB_URI in the .env.<development/production>.local file');
}

const connectToDB = async() => {
    try {
        await mongoose.connect(MONGODB_URI);
        logger.info(`Connected to database successfully`)
    } catch (error) {
        logger.error(`Connection to database failed: ${error.message}`);
        throw new Error('Connection to database failed');
    }
}

export default connectToDB;