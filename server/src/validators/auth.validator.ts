import { body } from "express-validator";

class AuthValidator {
    public login = [
        body("email").isEmail().normalizeEmail().withMessage("Provide a valid email address"),
        body("password").exists().withMessage("Provide a password")
    ]

    public refreshToken = [
        body("token").exists().withMessage("Provide a valid token")
    ]
}

const authValidator = new AuthValidator()

export { authValidator }