import { Request, Response } from "express";
import catchAsync from "../middleware/catch-async";
import { validationResult } from "express-validator";
import { userService } from "../services/user.service";
import { resetPassword } from "../responses";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

class UserController {
    //---------------------------------------//REGISTER USER//-------------------------------------//
    public register = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req) // Validate Fields

        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const { email, password1 } = req.body

        // Create User With Our Service
        await userService.createUser(email, password1)

        return res.sendStatus(200)
    })

    //----------------------------------------//VERIFY USER//--------------------------------------//
    public verifyEmail = catchAsync(async (req: Request, res: Response) => {
      const verificationToken = req.params.token
      
      jwt.verify(verificationToken, process.env.VERIFY_SECRET as Secret, async (err: VerifyErrors | null, decoded: unknown) => {
        if (err) return res.sendStatus(403)
        try {
            const { email } = decoded as { email: string }

            userService.findUserByVerficationToken(email, verificationToken)
            .then((user) => {
                if (!user || user.isVerified) {
                    return res.sendStatus(400)
                }

                userService.updateIsVerified(user, true).then(() => {
                    res.sendStatus(200)
                }).catch(() => {
                    return res.sendStatus(500)
                })
            })

            .catch(() => {
                return res.sendStatus(500)
            })
        } catch (error) {
            console.log(error)
            return res.sendStatus(403)
        }
      })
    })

    //--------------------------------------//GET CURRENT USER//-----------------------------------//
    public getUser = catchAsync(async (req: Request, res: Response) => {
        const userId = parseInt(req.params.id)

        const user = await userService.findUserById(userId)

        if (user === null) return res.sendStatus(400)

        return res.status(200).json(user)
    })

    //---------------------------------------//RESET PASSWORD//------------------------------------//
    public resetPassword = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req)

        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const { email } = req.body
        const user = await userService.findUserByEmail(email)

        if (!user) return res.status(200).json(resetPassword)

        await userService.resetPassword(user)

        return res.status(200).json(resetPassword)
    })

    //------------------------------------//CONFIRM RESET PASSWORD//-------------------------------//
    public confirmResetPassword = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req)

        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const resetPassswordToken = req.params.token
        const { password1 } = req.body

        jwt.verify(resetPassswordToken, process.env.PASSWORD_RESET as Secret, async (err: VerifyErrors | null, decoded: unknown) => {
            if (err) return res.sendStatus(403)

            try {
                const { email } = decoded as { email: string }
                userService.findUserByPasswordResetToken(email, resetPassswordToken).then((user) => {
                    if (!user) {
                        return res.sendStatus(400)
                    }

                    userService.updatePassword(user, password1).then(() => {
                        return res.sendStatus(200)
                    })
                    .catch(() => {
                        return res.sendStatus(500)
                    })
                })
                .catch(() => {
                    return res.sendStatus(500)
                })
            } catch (error) {
                console.log(error)
                return res.sendStatus(500)
            }
        })
    })
}

const userController = new UserController()

export { userController }