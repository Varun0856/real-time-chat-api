import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minLength: 4,
        maxLength: 20,
        lowercase: true,
        unique: [true, "Username must be unique"]
    },
    firstname: {
        type: String,
        required: [true, "Firstname is required"],
        trim: true,
        minLength: 2
    },
    lastname: {
        type: String,
        required: [true, "Lastname is required"],
        trim: true,
        minLength: 2,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: [true, "Email must be unique"],
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8,
        select: false,
    },
}, {
    timestamps: true,
})

const User =  mongoose.model(User, userSchema);

export default User;