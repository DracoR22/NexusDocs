import { validationResult } from "express-validator";
import catchAsync from "../middleware/catch-async";
import { Request, Response } from "express";
import { Document } from "../db/models/document.model";
import { User } from "../db/models/user.model";
import { DocumentUser } from "../db/models/document-user.model";
import { mailService } from "../services/mail.service";

class ShareController {
    public create = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req)

        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const { id } = req.params

        const document = await Document.findByPk(id)
        if (!document) return res.sendStatus(400)

        if (!req.user?.id || document.userId !== parseInt(req.user.id)) {
            return res.sendStatus(400)
        }

        const { email, permission } = req.body

        const sharedUser = await User.findOne({
            where: {
                email
            }
        })

        if (!sharedUser) return res.sendStatus(400)

        const documentUser = await DocumentUser.create({
            documentId: id,
            userId: sharedUser.id,
            permission
        })

        // Send Email 
        const mail = {
            from: 'monkmonkey56@gmail.com',
            to: sharedUser.email,
            subject: `${req.user.email} shared a document with you!`,
            text: `Click the following link to view an edit the document : http://localhost:3000/document/${id}`
        }

        // Send The Actual Email
        await mailService.sendMail(mail)

        return res.status(201).json(documentUser)
    })

    public delete = catchAsync(async (req: Request, res: Response) => {
        const err = validationResult(req)

        if (!err.isEmpty()) {
            return res.status(400).json(err)
        }

        const { documentId, userId } = req.params

        const document = await Document.findOne({
            where: {
                id: documentId,
                userId: req.user?.id
            }
        })

        if (!document) return res.sendStatus(400)

        const query = {
            where: {
                documentId,
                userId
            }
        }

        const documentUser = await DocumentUser.findOne(query)

        if (!documentUser) return res.sendStatus(400)

        await Document.destroy(query)

        return res.sendStatus(200)
    })
}

const shareController = new ShareController()

export { shareController }