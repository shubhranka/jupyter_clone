import { useEffect, useRef, useState } from "react";
import Editor from "../../Editor";
import IFrame from "../IFrame/IFrame";
import bundler from "../../bundler/bundler";
import "./CodeCell.css";
import { Resizable, ResizableBox } from "react-resizable";
import { initialize } from "esbuild-wasm";

const createBottomBar = () => {
  return (
    <div className="bottom_bar">
      <div className="circle1"></div>
      <div className="circle2"></div>
      <div className="circle1"></div>
    </div>
  );
};

const CodeCell: React.FC<{}> = (props) => {
  const newDivElement = document.createElement("div");
  newDivElement.style.position = "absolute";
  newDivElement.style.top = "0";
  newDivElement.style.left = "0";
  newDivElement.style.width = "100%";
  newDivElement.style.height = "100%";
  newDivElement.style.backgroundColor = "transparent";
  newDivElement.style.zIndex = "100";
  // newDivElement.style.pointerEvents = "none";

  // const [code, setCode] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeDivRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLIFrameElement>(null);
  const [myHeight, setMyHeight] = useState<number>(300);
  const rightBarRef = useRef<HTMLDivElement>(null);
  const [myWidth, setMyWidth] = useState<{
    width: number;
    widthPercentage: number;
  }>({ width: window.innerWidth * 0.5, widthPercentage: 0.5 });
  const [myWidthPercentage, setMyWidthPercentage] = useState<number>(0.5);
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  // const [editorWidth,setEditorWidth] = useState<number>(0);
  // const submitButtonRef = useRef<HTMLButtonElement>(null);

  // function f(myWidth:any) {
  // }
  useEffect(() => {
    let timer: any;
    const resizeFunction = (e: any) => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        // setMyWidth({width:window.innerWidth * myWidth.widthPercentage,widthPercentage:myWidth.widthPercentage});
        // setMyWidthPercentage(myWidth.widthPercentage);
        setInnerWidth(window.innerWidth);
        // if(timer)
        // clearTimeout(timer);

        // timer = setTimeout(()=>f(myWidth), 100);
      }, 100);
    };
    window.addEventListener("resize", resizeFunction);
    return () => {
      window.removeEventListener("resize", resizeFunction);
    };
  }, []);
  const onSubmitListener = (inp: string) => {
    (() => {
      try {
        if (iframeRef.current) {
          iframeRef.current.srcdoc = `
                <html>
                    <body>
                    <div id="root"></div>
                    </body>
                    <script>
                    const handleError = (e) => {
                      const errorTitle = e.stack.split(':')[0];
                      console.log(errorTitle);
                      document.body.innerHTML+= '<pre style="color:red">'+ '<h3>' + errorTitle+' :' + '</h3>' + e.message + '</pre>';
                      console.log({e});
                    }
                    const handleBundleError = (e) => {
                      console.log(e);
                      const errorTitle = "Syntax Error";
                      document.body.innerHTML+= '<pre style="color:red">'+ '<h3>' + errorTitle + ' :' + '</h3>' + 'At ' + e.location.line+ ':' + e.location.length +' ' + e.text + '</pre>';
                    }
                    window.addEventListener('error', (e) => {
                      e.preventDefault();
                      handleError(e.error);
                    });
                    window.addEventListener('message', (e) => {
                      console.log(e)
                        if(e.data.bundleError){
                          handleBundleError(e.data.bundleError);
                          // console.log(e)
                        }else{
                          try{
                              eval(e.data.code);
                          }catch(e){
                              handleError(e);
                          }
                        }
                        
                    },false);
                    </script>
                </html>
                `;
          setTimeout(async () => {
            if (inp !== "") {
              try {
                const data = await bundler(inp);
                console.log(data);
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(
                    {code:data.outputFiles[0].text},
                    "*"
                  );
                }
              } catch (e: any) {
                const errorString = e.toString();
                if (iframeRef.current?.contentWindow)
                  iframeRef.current.contentWindow.postMessage(
                    {bundleError:e.errors[0]},
                    "*"
                  );
                console.log({ e });
              }
            }
          }, 50);
        }
      } catch (e) {
        console.log(e);
      }
    })();
  };
  // useEffect(() => {

  // }, [code]);

  return (
    <ResizableBox
      height={myHeight}
      width={Infinity}
      resizeHandles={["s"]}
      handle={
        <div className="bottom_bar">
          <div className="circle1"></div>
          <div className="circle2"></div>
          <div className="circle1"></div>
        </div>
      }
      minConstraints={[Infinity, 100]}
      onResizeStart={() => {
        if (iframeDivRef?.current) {
          iframeDivRef.current.appendChild(newDivElement);
        }
      }}
      onResizeStop={(e, t) => {
        if (iframeDivRef?.current) {
          try {
            iframeDivRef.current.removeChild(newDivElement);
          } catch (e) {
            console.log(e);
          }
        }
        // setMyHeight(t.size.height);
      }}
    >
      <div className="code_cell">
        <ResizableBox
          width={myWidth.widthPercentage * innerWidth}
          height={Infinity}
          resizeHandles={["e"]}
          // minConstraints={[100, 100]}
          handle={
            <div className="right_bar" ref={rightBarRef}>
              <div className="circle1"></div>
              <div className="circle2"></div>
              <div className="circle1"></div>
            </div>
          }
          onResizeStart={() => {
            if (iframeDivRef?.current) {
              iframeDivRef.current.appendChild(newDivElement);
            }
          }}
          onResizeStop={(e, t) => {
            if (iframeDivRef?.current) {
              iframeDivRef.current.removeChild(newDivElement);
            }
            // Get size of e
            // if (editorRef.current) {
            //   console.log((editorRef.current.width / window.innerWidth));
            // }
            const width = t.size.width;
            // console.log((width),myWidth.widthPercentage,window.innerWidth);
            // setWidthPercentage((width / window.innerWidth));
            // console.log(width, width / window.innerWidth);
            setMyWidth({
              width: width,
              widthPercentage: width / window.innerWidth,
            });
            // console.log(myWidth);
          }}
          onResize={(e, t) => {
            // console.log(t.size.width,"onResize");
            // setMyWidth(t.size.width);
            if (editorRef.current) {
              editorRef.current.style.width = `${t.size.width - 16}px`;
            }
          }}
        >
          <div
            className="editer_wrapper"
            ref={editorRef}
            style={{ width: myWidth.widthPercentage * innerWidth - 16 }}
          >
            <Editor
              // onChangeHandler={(inp: string | undefined) => setInput(inp as string)}
              // onSubmitHandle={() => submitButtonRef.current?.click()}
              onSubmitHandle={onSubmitListener}
            />
          </div>
        </ResizableBox>

        <div ref={iframeDivRef}>
          <IFrame iframeRef={iframeRef} />
        </div>
      </div>
    </ResizableBox>
  );
};

export default CodeCell;
