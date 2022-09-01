import { useEffect, useRef, useState } from "react";
import Editor from "../../Editor";
import IFrame from "../IFrame/IFrame";
import bundler from "../../bundler/bundler";
import "./CodeCell.css";

const CodeCell : React.FC<{}> = (props) => {
    const [code, setCode] = useState<string>("");
    const iframeRef = useRef<HTMLIFrameElement>(null);
    // const submitButtonRef = useRef<HTMLButtonElement>(null);
  
    const onSubmitListener = (inp:string) => {
      setCode(inp);
    };
    useEffect(()=>{
      ( async ()=>{
      if (iframeRef.current)
          iframeRef.current.srcdoc = `
              <html>
                  <body>
                      <div id="root"></div>
                  </body>
                  <script>
                  window.addEventListener('message', (e) => {
                      try{
                          eval(e.data);
                      }catch(e){
                          const errorTitle = e.stack.split(':')[0];
                          console.log(errorTitle);
                          document.body.innerHTML+= '<pre style="color:red">'+ '<h3>' + errorTitle+' :' + '</h3>' + e.message + '</pre>';
                          console.log({e});
                      }
                      
                  },false);
                  </script>
              </html>
              `;
  
              try{
                  const data = await bundler(code);
                  if (iframeRef.current?.contentWindow) {
                    iframeRef.current.contentWindow.postMessage(
                      data.outputFiles[0].text,
                      "*"
                    );
                  }
              }catch(e){
                  console.log(e);
              }
          })()
    },[code])
  
    return (
      <div className="code_cell">
        <Editor
          // onChangeHandler={(inp: string | undefined) => setInput(inp as string)}
          // onSubmitHandle={() => submitButtonRef.current?.click()}
          onSubmitHandle={onSubmitListener}
        />
        {/* <button ref={submitButtonRef} onClick={()=>onSubmitListener(input)}>
          RUN
        </button> */}
        <IFrame iframeRef={iframeRef} />
      </div>
    );
}

export default CodeCell;