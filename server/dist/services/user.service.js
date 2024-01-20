"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_model_1 = require("../db/models/user.model");
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const refresh_token_model_1 = require("../db/models/refresh-token.model");
const mail_service_1 = require("./mail.service");
dotenv_1.default.config();
class UserService {
    constructor() {
        //-------------------------------------//GET USER BY EMAIL//-----------------------------------//
        this.findUserByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({
                where: {
                    email
                },
            });
            return user;
        });
        //----------------------------------------//CREATE USER//--------------------------------------//
        this.createUser = (email, password) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcrypt_1.genSalt)();
            const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
            const verificationToken = jsonwebtoken_1.default.sign({ email }, process.env.VERIFY_SECRET);
            const user = yield user_model_1.User.create({
                email,
                password: hashedPassword,
                verificationToken
            });
            // Call Method To Send Verification Email
            yield this.sendVerificationEmail(user);
        });
        //-------------------------------------//VERIFICATION EMAIL//----------------------------------//
        this.sendVerificationEmail = (user) => __awaiter(this, void 0, void 0, function* () {
            const mail = {
                from: 'monkmonkey56@gmail.com',
                to: user.email,
                subject: `Welcome to Nexus Docs`,
                text: `Click the following link to verify your account : http://localhost:3000/user/verify-email/${user.verificationToken}`
            };
            yield mail_service_1.mailService.sendMail(mail);
        });
        //-----------------------------------//VERIFICATION PASSWORD//---------------------------------//
        this.sendResetPasswordEmail = (user) => __awaiter(this, void 0, void 0, function* () {
            const mail = {
                from: 'monkmonkey56@gmail.com',
                to: user.email,
                subject: `Reset your password`,
                text: `Click the following link to change your password : http://localhost:3000/user/reset-password/${user.passwordResetToken}`
            };
            yield mail_service_1.mailService.sendMail(mail);
        });
        //----------------------------------//CHECK PASSWORD IN LOGIN//--------------------------------//
        this.checkPassword = (user, password) => __awaiter(this, void 0, void 0, function* () {
            return yield (0, bcrypt_1.compare)(password, user.password);
        });
        //-------------------------------------//CREATE USER OBJECT//----------------------------------//
        this.getRequestUser = (user) => __awaiter(this, void 0, void 0, function* () {
            if (user instanceof user_model_1.User) {
                const userWithRoles = yield user_model_1.User.scope('withRoles').findByPk(user.id);
                const roles = userWithRoles === null || userWithRoles === void 0 ? void 0 : userWithRoles.userRoles.map((userRole) => userRole.role.name);
                return {
                    id: user.id,
                    email: user.email,
                    roles: roles
                };
            }
            else {
                return user;
            }
        });
        //---------------------------------------//CREATE JWT TOKEN//------------------------------------//
        this.generateAuthResponse = (user) => __awaiter(this, void 0, void 0, function* () {
            const requestUser = yield this.getRequestUser(user);
            const accessToken = jsonwebtoken_1.default.sign(requestUser, process.env.ACCESS_TOKEN, {
                expiresIn: '24h'
            });
            const refreshToken = jsonwebtoken_1.default.sign(requestUser, process.env.REFRESH_SECRET, {
                expiresIn: '24h'
            });
            yield refresh_token_model_1.RefreshToken.destroy({
                where: { userId: requestUser.id }
            });
            yield refresh_token_model_1.RefreshToken.create({ token: refreshToken, userId: requestUser.id });
            return { accessToken, refreshToken };
        });
        //----------------------------------------//REFRESH TOKEN//-------------------------------------//
        this.getIsTokenActive = (token) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = yield refresh_token_model_1.RefreshToken.findOne({
                where: {
                    token
                }
            });
            return refreshToken != null;
        });
        //-----------------------------------------//LOGOUT USER//--------------------------------------//
        this.logoutUser = (userId) => __awaiter(this, void 0, void 0, function* () {
            yield refresh_token_model_1.RefreshToken.destroy({
                where: {
                    userId
                }
            });
        });
        //---------------------------------------//GET USER BY ID//-------------------------------------//
        this.findUserById = (id) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findByPk(id);
            return user;
        });
        //----------------------------------------//RESET PASSWORD//-------------------------------------//
        this.resetPassword = (user) => __awaiter(this, void 0, void 0, function* () {
            const passwordResetToken = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.PASSWORD_RESET, { expiresIn: '24h' });
            yield user.update({ passwordResetToken });
            //Send Password Reset Email
            yield this.sendResetPasswordEmail(user);
        });
        //-------------------------------//FIND USER BY PASSWORD RESET TOKEN//---------------------------//
        this.findUserByPasswordResetToken = (email, passwordResetToken) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({
                where: {
                    email,
                    passwordResetToken
                }
            });
            return user;
        });
        //-------------------------------------//UPDATE USER PASSWORD//----------------------------------//
        this.updatePassword = (user, password) => __awaiter(this, void 0, void 0, function* () {
            const salt = yield (0, bcrypt_1.genSalt)();
            const hashedPassword = yield (0, bcrypt_1.hash)(password, salt);
            yield user.update({
                password: hashedPassword
            });
        });
        //--------------------------------//FIND USER BY VERIFICATION TOKEN//----------------------------//
        this.findUserByVerficationToken = (email, verificationToken) => __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.User.findOne({
                where: {
                    email,
                    verificationToken
                }
            });
            return user;
        });
        //-------------------------------------------//VERIFY USER//------------------------------------//
        this.updateIsVerified = (user, isVerified) => __awaiter(this, void 0, void 0, function* () {
            yield user.update({
                isVerified
            });
        });
    }
}
const userService = new UserService();
exports.userService = userService;
