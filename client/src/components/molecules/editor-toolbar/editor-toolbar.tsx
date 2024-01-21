import { useContext } from "react"
import { EditorContext } from "../../../contexts/editor-context"
import { EditorState, RichUtils, convertToRaw } from "draft-js"
import FontSelect from "../../atoms/font-select"
import IconButton from "../../atoms/icon-button"
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/outline"
import DocumentService from "../../../services/document-service"
import useAuth from "../../../hooks/use-auth"
import axios from "axios"
import { useParams } from "react-router-dom"
import API, { BASE_URL } from "../../../services/api"

const EditorToolbar = () => {

  const {id } = useParams()
   const { accessToken} = useAuth()
   const { editorState, setEditorState, handleEditorChange } = useContext(EditorContext)

   const handleUndoBtnClick = () => {
    setEditorState(EditorState.undo(editorState))
   }

   const handleRedoBtnClick = () => {
    setEditorState(EditorState.redo(editorState))
   }

  const handleBold = async () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, 'BOLD');
    setEditorState(newEditorState);
  };
  
  const handleTitle = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, 'TITLE');
    setEditorState(newEditorState);
  };

  const handleAlignCenter = () => {
    const newEditorState = RichUtils.toggleInlineStyle(editorState, 'ALIGN_CENTER');
    setEditorState(newEditorState);
  };
  

  return (
    <div className="w-full h-9 px-3 py-1 flex-shrink-0 flex items-center">
    <IconButton onClick={handleUndoBtnClick} icon={<ArrowLeftIcon className="h-4 w-4" />} tooltip="Undo"/>
    <IconButton onClick={handleRedoBtnClick} icon={<ArrowRightIcon className="h-4 w-4" />} tooltip="Redo"/>
    <div className="h-5 border-1 border-1-gray-300 mx-2"></div>
    <FontSelect/>
    <button onClick={handleBold} className="font-bold ml-2 py-1 px-2 rounded-sm hover:bg-neutral-100">B</button>
    <button onClick={handleTitle} className="font-medium ml-2 py-1 px-2 rounded-sm hover:bg-neutral-100">h1</button>
    <button onClick={handleAlignCenter} className="font-medium ml-2 py-1 px-2 rounded-sm hover:bg-neutral-100">C</button>
  </div>
  )
}

export default EditorToolbar