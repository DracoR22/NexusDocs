"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("./user.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const document_route_1 = __importDefault(require("./document.route"));
const router = (0, express_1.Router)();
router.use('/user', user_route_1.default);
router.use('/auth', auth_route_1.default);
router.use('/document', document_route_1.default);
exports.default = router;
