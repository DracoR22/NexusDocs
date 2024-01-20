import { Request, Response } from "express";
import catchAsync from "../middleware/catch-async";
import { validationResult } from "express-validator";
import { userService } from "../services/user.service";
import { emailNotVerified, userNotFound } from "../responses";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken";
import dotenv from "dotenv"
import { error } from "console";

dotenv.config()

class AuthController {
    //-----------------------------------------//LOGIN USER//--------------------------------------//
    public login = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req) // Validate Fields
        
        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const { email, password } = req.body

        const user = await userService.findUserByEmail(email)
        if (!user) {
            return res.status(401).json({ errors: userNotFound })
        }

        const validPassword = await userService.checkPassword(user, password)
        if (!validPassword) {
          return res.status(401).json({ errors: userNotFound })
        }

        if (!user.isVerified) {
            res.status(403).json({ errors: emailNotVerified })
        }

        const authResponse = await userService.generateAuthResponse(user)

        return res.status(200).json(authResponse)
    })
    //----------------------------------------//REFRESH TOKEN//------------------------------------//
    public refreshToken = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req) // Validate Fields

        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const refreshToken = req.body.token

        const isTokenActive = await userService.getIsTokenActive(refreshToken)
        if (!isTokenActive) {
            return res.sendStatus(401)
        }

        jwt.verify(refreshToken, process.env.REFRESH_SECRET as Secret, async (error: VerifyErrors | null, decoded: unknown) => {
            if (error) return res.sendStatus(403)

            try {
                const { id, email, roles } = decoded as RequestUser
                const user = { id, email, roles }

                const authResponse = await userService.generateAuthResponse(user)
                return res.status(200).json(authResponse)
            } catch (error) {
                console.log(error)
                res.sendStatus(403)
            }
        })
    })
    //----------------------------------------//LOGOUT USER//--------------------------------------//
    public logout = catchAsync(async (req: Request, res: Response) => {
        if (!req.user) return res.sendStatus(401)

        const userId = parseInt(req.user.id)
        await userService.logoutUser(userId)

        return res.sendStatus(200)
    })
}

const authController = new AuthController()

export { authController }