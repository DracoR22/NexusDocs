"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? new sequelize_typescript_1.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
}) : new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});
exports.default = sequelize;
