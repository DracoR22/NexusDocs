import { ChangeEvent, FocusEvent, useContext, useEffect, useState } from "react"
import useAuth from "../../../hooks/use-auth"
import { DocumentContext } from "../../../contexts/document-context"
import DocumentInterface from "../../../types/interfaces/document"
import DocumentService from "../../../services/document-service"
import UserDropDown from "../../atoms/user-dropdown/user-dropdown"
import useRandomBackground from "../../../hooks/use-random-background"
import { useParams } from "react-router-dom"
import useDocument from "../../../hooks/use-document"

const CurrentUsers = () => {
    const { email } = useAuth();
    const { currentUsers } = useContext(DocumentContext);
    const { backgroundColor } = useRandomBackground();
    return (
      <>
        {Array.from(currentUsers)
          .filter((currentUser) => currentUser !== email)
          .map((currentUser) => {
            return (
              <div
                key={currentUser}
                className={`${backgroundColor} w-8 h-8 text-white font-semibold flex justify-center items-center rounded-full flex-shrink-0 uppercase ring-2`}
              >
                {currentUser[0]}
              </div>
            );
          })}
      </>
    );
  };


const DocumentMenuBar = () => {
   const { id } = useParams()

   const { accessToken, userId } = useAuth()
   const { saving, setDocument, setSaving, setErrors } = useContext(DocumentContext) 
   const { document } = useDocument(parseInt(id))

   const [upTitle, setUpTitle] = useState<string>('');

   useEffect(() => {
     if (document && document.title) {
       setUpTitle(document.title);
     }
   }, [document]);
 
   const handleTitleInputChange = (event) => {
     const title = event.target.value;
     setUpTitle(title);
   };

   // UPDATE DOCUMENT TITLE
  const handleTitleInputBlur = async (event: FocusEvent<HTMLInputElement>) => {
    if (accessToken === null || document === null) return

    setSaving(true)

    const title = (event.target as HTMLInputElement).value
    
    const updatedDocument = {...document, title } as DocumentInterface
  
    try {
        await DocumentService.update(accessToken, updatedDocument)
    } catch (error) {
        setErrors(['There was an error saving the document. Please try again later.'])
    } finally {
        setDocument(updatedDocument)
        setSaving(false)
    }
  }
  return (
    <div className="w-full flex justify-between items-center px-3 pb-1 border-b">
      <div className="w-full flex justify-start items-center overflow-x-hidden md:overflow-visible">
        {/* LOGO */}
        <h1 className="text-2xl font-bold hidden sm:flex mr-6">NEXUS <span className="text-sky-500 pl-1"> DOCS</span></h1>
        {/* TITLE INPUT */}
         <div className="flex flex-col">
            <input maxLength={25} type="text" className="font-semibold text-xl my-2 px-2 pt-2 outline-none" placeholder="Untitled Document"
             onBlur={(event) => handleTitleInputBlur(event)} name="title" id="title"
             onChange={(event) => handleTitleInputChange(event)} value={upTitle}/>
             <div className="flex items-center">
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              File
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              Edit
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              View
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              Insert
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              Format
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              Tools
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              Add-ons
            </button>
            <button className="text-sm whitespace-nowrap px-2 py-1 font-medium hover:bg-gray-100 rounded-md">
              Help
            </button>
            {saving && <p className="text-sm text-gray-500 px-2">Saving...</p>}
          </div>
         </div>
      </div>

      <div className="flex items-center flex-shrink-0 pl-3 gap-x-4">
        {document !== null && document.userId === userId && (
        //   <ShareDocumentModal /> 
       <h1> Share button</h1>
        )}
        <div className="flex items-center gap-x-2">
          <CurrentUsers />
          <UserDropDown/>
        </div>
      </div>
    </div>
  )
}

export default DocumentMenuBar