import { useParams } from "react-router-dom"
import useDocument from "../../../hooks/use-document"
import { ChangeEvent, useContext, useRef, useState } from "react"
import { DocumentContext } from "../../../contexts/document-context"
import useAuth from "../../../hooks/use-auth"
import validator from "validator"
import PermissionEnum from "../../../types/enums/permission-enum"
import DocumentUserService from "../../../services/document-user-service"
import DocumentUser from "../../../types/interfaces/document-user"
import { ToastContext } from "../../../contexts/toast-context"
import DocumentInterface from "../../../types/interfaces/document"

const ShareDocumentModal = () => {
   const { id } = useParams()

   const { saving, saveDocument, setDocument } = useContext(DocumentContext)

   const { document } = useDocument(parseInt(id))
   const { accessToken } = useAuth()

   const { success, error } = useContext(ToastContext)

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
        const documentUser = response.data as DocumentUser
        documentUser.user = { email }

        success(`Succesfully shared dpcument with ${email}`)

        setDocument({...document, users: [...document.users, documentUser]} as DocumentInterface)

        setEmail('')
    } catch (error) {
        error(`Unable to share this document. Please try again later.`)
    } finally {
        setLoading(false)
    }
 }

    const handleShareEmailInputChange = (event: ChangeEvent) => {
        setEmail((event.target as HTMLInputElement).value)
    }

    const handleCopyLinkBtnClick = () => {
        if (copyLinkInputRef === null || copyLinkInputRef.current === null) return;
    
        const url = window.location.href;
        copyLinkInputRef.current.value = url;
        copyLinkInputRef.current.focus();
        copyLinkInputRef.current.select();
        window.document.execCommand("copy");
      };
    
      const handleOnKeyPress = async (event: KeyboardEvent) => {
        if (event.key === "Enter") await shareDocument();
      };
    
      const updateIsPublic = (isPublic: boolean) => {
        const updatedDocument = {
          ...document,
          isPublic: isPublic,
        } as DocumentInterface;
    
        saveDocument(updatedDocument);
      };
    
      const handleShareBtnClick = async () => {
        await shareDocument();
      };
    
      const alreadyShared = document === null || (document !== null && document.users.filter((documentUser) => documentUser.user.email === email).length > 0);

  return (
    <div>ShareDocumentModal</div>
  )
}

export default ShareDocumentModal