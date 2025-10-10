import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        minlength: 4,
        maxlength: 20,
        lowercase: true,
        unique: [true, "Username must be unique"]
    },
    firstname: {
        type: String,
        required: [true, "Firstname is required"],
        trim: true,
        minlength: 2
    },
    lastname: {
        type: String,
        required: [true, "Lastname is required"],
        trim: true,
        minlength: 2,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: (props) => `${props.value} is not a value field`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: 8,
        select: false,
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {type: Date},
    avatarUrl: {type: String}
}, {
    timestamps: true,
});

userSchema.index({ username: 1}, { unique: true });
userSchema.index({ email: 1}, { unique: true });

const User = mongoose.models.User ||  mongoose.model('User', userSchema);

export default User;