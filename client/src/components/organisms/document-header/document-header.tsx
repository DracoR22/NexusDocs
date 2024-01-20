import { MutableRefObject } from "react"

interface DocumentHeaderProps {
    documentHeaderRef: MutableRefObject<null | HTMLDivElement>
}

const DocumentHeader = ({ documentHeaderRef }: DocumentHeaderProps) => {
  return (
    <div ref={documentHeaderRef} className="border-b w-full bg-white flex flex-col">
     {/* <DocumentMenuBar /> */}
     {/* <EditorToolbar /> */}
    </div>
  )
}

export default DocumentHeader