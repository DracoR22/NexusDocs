import { Router } from "express";
import { userValidator } from "../validators/user.validator";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";

const router = Router()

router.post('/create', userValidator.register, userController.register)
router.get('/:id', authenticate, userController.getUser)
router.post('/reset-password', userValidator.resetPasssword, userController.resetPassword)
router.put('/password/:token', userValidator.confirmResetPassword, userController.confirmResetPassword)
router.put("/verify-email/:token", userController.verifyEmail)

export default router