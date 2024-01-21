import { useContext, useState } from "react"
import { EditorContext } from "../../../contexts/editor-context"
import { Editor, EditorState } from "draft-js"

const DocumentEditor = () => {

   const { editorState, editorRef, handleEditorChange, focusEditor } = useContext(EditorContext)
//    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    return (
    <div style={{height: '1100px', width: '850px'}} className="bg-white shadow-md flex-shrink-0 cursor-text p-12"
    onClick={focusEditor}>
      <Editor ref={editorRef} editorState={editorState} onChange={handleEditorChange} />
    </div>
  )
}

export default DocumentEditor