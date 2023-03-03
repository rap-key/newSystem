import React,{useState,useEffect} from 'react'
import{Editor} from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

import htmlToDraft from 'html-to-draftjs'

export default function NewsEditor(props) {

  useEffect(() => {
    // console.log(props.content);
    const html = props.content
    if(html===undefined)return
    const contentBlock = htmlToDraft(html)
    if(contentBlock){
      const contentState = ContentState.createFromBlockArray
      (contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent
      (contentState);
      seteditorState(editorState)
    }
  }, [props.content])
  

    const [editorState, seteditorState] = useState('')

  return (
    <div>
        <Editor
        editorState={editorState}
        toolbarClassName='aaa'
        wrapperClassName='bbb'
        editorClassName='ccc'
        onEditorStateChange={(editorState)=>seteditorState(editorState)}

        onBlur={()=>{
            // console.log()

            props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
        />
    </div>
  )
}
