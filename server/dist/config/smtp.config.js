"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = (0, nodemailer_1.createTransport)({
    port: 465,
    host: 'smtp.gmail.com',
    auth: {
        user: 'monkmonkey56@gmail.com',
        pass: process.env.SMTP_PASSWORD
    },
    secure: true
});
exports.default = transporter;
