import { NextFunction, Request, Response } from "express";
import jwt, { Secret, VerifyErrors } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN as Secret, (err: VerifyErrors | null, decoded: unknown) => {
        if (err) return res.sendStatus(403)
        try {
            const { id, email, roles } = decoded as RequestUser
            req.user = { id, email, roles }
            next()
        } catch (error) {
            console.log(error)
            return res.sendStatus(403)
        }
    })
}

export { authenticate }