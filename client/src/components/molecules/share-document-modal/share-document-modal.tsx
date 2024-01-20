import { useParams } from "react-router-dom"
import useDocument from "../../../hooks/use-document"
import { useContext, useRef, useState } from "react"
import { DocumentContext } from "../../../contexts/document-context"
import useAuth from "../../../hooks/use-auth"
import validator from "validator"
import PermissionEnum from "../../../types/enums/permission-enum"
import DocumentUserService from "../../../services/document-user-service"

const ShareDocumentModal = () => {
   const { id } = useParams()

   const { saving, saveDocument, setDocument } = useContext(DocumentContext)

   const { document } = useDocument(parseInt(id))
   const { accessToken } = useAuth()

   const [email, setEmail] = useState<null | string>(null)
   const [loading, setLoading] = useState<boolean>(false)

   const copyLinkInputRef = useRef<null | HTMLInputElement>(null)

   const shareDocument = async () => {
    if (email === null || !validator.isEmail(email || accessToken === null || document === null)) {
        return
    }

    const payload = {
        documentId: document.id,
        email: email,
        permission: PermissionEnum.EDIT
    }

    setLoading(true)

    try {
        const response = await DocumentUserService.create(accessToken, payload)
    } catch (error) {
        
    }
   }

  return (
    <div>ShareDocumentModal</div>
  )
}

export default ShareDocumentModal