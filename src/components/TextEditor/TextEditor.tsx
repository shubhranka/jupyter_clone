import MDEditor from "@uiw/react-md-editor";
import { useEffect, useState } from "react";
import "./TextEditor.css";
const TextEditor = () => {
  const [value, setValue] = useState<any>("# Hello world!");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const listener = (event: any) => {
        for(let ele of event.path){
            if(ele.className === "editor_container"){
                return;
            }
        }
        setEditing(false);
    };
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  })
  return (
    <div className="editor_container" onClick={()=>{
        setEditing(true);
    }}>
      {editing ? (
        <MDEditor value={value} onChange={(v) => setValue(v)} />
      ) : (
        <MDEditor.Markdown source={value} style={{padding:"1rem"}} />
      )}
    </div>
  );
};

export default TextEditor;
