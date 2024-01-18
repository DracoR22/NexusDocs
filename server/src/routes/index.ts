import { Router } from "express";
import user from "./user.route"
import auth from "./auth.route"
import document from "./document.route"

const router = Router()

router.use('/user', user)
router.use('/auth', auth)
router.use('/document', document)

export default router