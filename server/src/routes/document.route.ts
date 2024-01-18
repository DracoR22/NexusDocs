import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { documentController } from "../controllers/document.controller";
import { documentValidator } from "../validators/document.validator";
import { shareValidator } from "../validators/share.validator";
import { shareController } from "../controllers/share.controller";

const router = Router()

router.get('/:id', authenticate, documentController.getOne)
router.get('/get-all', authenticate, documentController.getAll)
router.put('/update/:id', authenticate, documentValidator.update, documentController.update)
router.post('/create', authenticate, documentController.create)
router.delete('/delete/:id', authenticate, documentController.delete)
router.post('/:id/share', authenticate, shareValidator.create, shareController.create)
router.delete('/:documentId/share/:userId', authenticate, shareController.delete)

export default router