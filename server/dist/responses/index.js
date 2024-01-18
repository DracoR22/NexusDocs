"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.emailNotVerified = exports.userNotFound = void 0;
const userNotFound = [
    {
        msg: "Your email or password is incorrect"
    }
];
exports.userNotFound = userNotFound;
const emailNotVerified = [
    {
        msg: "Please verify your email before logging in"
    }
];
exports.emailNotVerified = emailNotVerified;
const resetPassword = [
    {
        msg: "You will receive an email with instructions to reset your password"
    }
];
exports.resetPassword = resetPassword;
