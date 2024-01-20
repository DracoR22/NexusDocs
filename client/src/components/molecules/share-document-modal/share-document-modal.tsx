import { useParams } from "react-router-dom"
import useDocument from "../../../hooks/use-document"
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react"
import { DocumentContext } from "../../../contexts/document-context"
import useAuth from "../../../hooks/use-auth"
import validator from "validator"
import PermissionEnum from "../../../types/enums/permission-enum"
import DocumentUserService from "../../../services/document-user-service"
import DocumentUser from "../../../types/interfaces/document-user"
import { ToastContext } from "../../../contexts/toast-context"
import DocumentInterface from "../../../types/interfaces/document"
import Modal from "../../atoms/modal"
import { LinkIcon, UserAddIcon } from "@heroicons/react/outline"
import Spinner from "../../atoms/spinner"
import Sharedusers from "../shared-users/shared-users"

const ShareDocumentModal = () => {
   const { id } = useParams()

   const { document, saving, saveDocument, setDocument } = useContext(DocumentContext)

//    const { document } = useDocument(parseInt(id))
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

        success(`Succesfully shared document with ${email}`)

        setDocument({...document, users: [...document.users, documentUser]} as DocumentInterface)

        setEmail('')
    } catch (err) {
        error(`The user your trying to share your document with was not found.`)
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
    
      const updateIsPublic = async (isPublic: boolean) => {
        const updatedDocument = {
          ...document,
          isPublic: isPublic,
        } as DocumentInterface;
    
        await saveDocument(updatedDocument);
      }
    
      const handleShareBtnClick = async () => {
        await shareDocument();
      };
    
      const alreadyShared = document === null || (document !== null && document.users.filter((documentUser) => documentUser.user.email === email).length > 0);

      const publicAccessBtn = (
        <div className="space-y-1">
          <button
            disabled={saving}
            onClick={() => updateIsPublic(false)}
            className="font-semibold text-blue-600 p-2 hover:bg-blue-50 rounded-md"
          >
            {saving && <Spinner size="sm" />}
            <span className={`${saving && "opacity-0"}`}>
              Change to only shared users
            </span>
          </button>
          <p className="mx-2">
            <b className="font-semibold">Public</b>
            <span className="text-gray-600"> Anyone with this link can view</span>
          </p>
        </div>
      );
    
      const restrictedAccessBtn = (
        <div className="space-y-1">
          <button
            disabled={saving}
            onClick={() => updateIsPublic(true)}
            className="font-semibold text-blue-600 p-2 hover:bg-blue-50 rounded-md"
          >
            {saving && <Spinner size="sm" />}
            <span className={`${saving && "opacity-0"}`}>
              Change to anyone with the link
            </span>
          </button>
          <p className="mx-2">
            <b className="font-semibold">Restricted </b>
            <span className="text-gray-600">
              Only people added can open with this link
            </span>
          </p>
        </div>
      );
     
  return (
    <Modal button = {
      <button className="flex items-center gap-x-2 bg-neutral-200 rounded-full px-6 p-2 hover:bg-neutral-300 transition ">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
        </svg>
        <span>Share</span>
      </button>
    }
    content = {
      document === null ? (
        <></>
      ) : (
        <div
        // @ts-expect-error
          onKeyPress={(event) => handleOnKeyPress(event)}
          className="space-y-4 text-sm"
        >
          <div className="rounded-md bg-white shadow-xl p-4 space-y-4">
            <div className="flex items-center space-x-2 m-2">
              <div className="w-8 h-8 bg-blue-500 flex justify-center items-center rounded-full text-white">
                <UserAddIcon className="w-5 h-5 relative" />
              </div>
              <h1 className="text-xl font-medium">Share with people</h1>
            </div>
            <input type="text" name="" id="" value={email !== null ? email : ""} onChange={handleShareEmailInputChange}
              placeholder="Enter email" className="border-b border-blue-500 rounded-t-md p-4 w-full bg-gray-100 font-medium"/>
            <Sharedusers documentUsers={document.users} setDocument={setDocument}/>
            <div className="w-full flex justify-end space-x-2">
              <button onClick={handleShareBtnClick} disabled={
                  loading ||
                  email === null ||
                  !validator.isEmail(email) ||
                  alreadyShared
                }
                className={`${email === null || !validator.isEmail(email) || alreadyShared ? "btn-disabled" : "btn-primary"} px-6`}>
                {loading && <Spinner size="sm" />}
                <span className={`${loading && "opacity-0"}`}>Share</span>
              </button>
            <div className="rounded-md bg-white shadow-xl p-4 space-y-4 flex flex-col">
           </div>
          </div>
           <div className="m-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-400 flex justify-center items-center rounded-full text-white">
                <LinkIcon className="w-5 h-5 relative" />
              </div>
              <h1 className="text-xl font-medium">Get Link</h1>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  {document.isPublic ? publicAccessBtn : restrictedAccessBtn}
                </div>
                <input
                  ref={copyLinkInputRef}
                  type="text"
                  className="d-none opacity-0 cursor-default"
                />
                <button
                  onClick={handleCopyLinkBtnClick}
                  className="font-semibold text-blue-600 p-2 hover:bg-blue-50 rounded-md"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  />
  )
}

export default ShareDocumentModal