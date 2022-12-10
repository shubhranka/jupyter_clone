import { useEffect, useRef, useState } from "react";
import { RootState, useAppDispatch } from "../../store/store";
import Editor from "../../Editor";
import IFrame from "../IFrame/IFrame";
import bundler from "../../bundler/bundler";
import "./CodeCell.css";
import { ResizableBox } from "react-resizable";
import { useDispatch, useSelector } from "react-redux";
import { actions, CellData } from "../../store/features/cell/cellReducer";
import { bundleAction } from "../../store/features/bundle/bundleReducer";
import { Grid } from "react-loader-spinner";

interface CodeCellProps {
  cellData: CellData;
}
// const createBottomBar = () => {
//   return (
//     <div className="bottom_bar">
//       <div className="circle1"></div>
//       <div className="circle2"></div>
//       <div className="circle1"></div>
//     </div>
//   );
// };

const CodeCell: React.FC<CodeCellProps> = ({ cellData }) => {
  const dispatch = useDispatch();
  const appDispatch = useAppDispatch();
  let bundleState = useSelector(
    (state: RootState) => state.bundleReducer[cellData.id]
  );
  if(!bundleState){
    bundleState = {
      code: "",
      error: null,
      loading: false,
    }
  }
  // const [loading, setLoading] = useState(bundleState.loading);
  // const cellState = useSelector((state: RootState) => state.cellReducer);
  console.log(bundleState);
  console.log(cellData);
  const newDivElement = document.createElement("div");
  newDivElement.style.position = "absolute";
  newDivElement.style.top = "0";
  newDivElement.style.left = "0";
  newDivElement.style.width = "100%";
  newDivElement.style.height = "100%";
  newDivElement.style.backgroundColor = "transparent";
  newDivElement.style.zIndex = "100";
  // newDivElement.style.pointerEvents = "none";
  let iframeStyle = {};
  if (bundleState.loading) {
    iframeStyle = {
      blur: "blur(5px)",
    };
  }
  // const [code, setCode] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeDivRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<HTMLIFrameElement>(null);
  const rightBarRef = useRef<HTMLDivElement>(null);

  const code = useSelector(
    (state: RootState) => state.cellReducer.data[cellData.id].content
  );
  const [myWidth, setMyWidth] = useState<{
    width: number;
    widthPercentage: number;
  }>({ width: window.innerWidth * 0.5, widthPercentage: 0.5 });
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);
  // console.log(srcDocObj);
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

  useEffect(() => {
    appDispatch(bundleAction({ id: cellData.id, code: code }));
  }, [code]);

  useEffect(() => {
    if (iframeRef.current){
      iframeRef.current.innerHTML = "";
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
                      // console.log({e});
                    }
                    const handleBundleError = (e) => {
                      // console.log(e);
                      const errorTitle = "Syntax Error";
                      document.body.innerHTML+= '<pre style="color:red">'+ '<h3>' + errorTitle + ' :' + '</h3>' + 'At ' + e.location.line+ ':' + e.location.length +' ' + e.text + '</pre>';
                    }
                    window.addEventListener('error', (e) => {
                      e.preventDefault();
                      handleError(e.error);
                    });
                    window.addEventListener('message', (e) => {
                      // console.log(e)
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
                      setTimeout(() => {
      if (iframeRef.current) {
        if (bundleState.error) {
          iframeRef.current.contentWindow?.postMessage(
            { bundleError: bundleState.error },
            "*"
            );
        } else {
          iframeRef.current.contentWindow?.postMessage(
            { code: bundleState.code },
            "*"
            );
          }
        }
      }, 50);
    }
  }, [bundleState]);
  
  const onSubmitListener = (inp: string) => {
    dispatch(actions.update_cell({ id: cellData.id, content: inp }));
  };
  // useEffect(() => {

  // }, [code]);

  return (
    <div className="code_cell_container">
      <ResizableBox
        //  className="code_cell_resizable_box"
        height={300}
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
                cellData={cellData}
              />
            </div>
          </ResizableBox>

          <div ref={iframeDivRef} style={{ position: "relative" }}>
            {bundleState.loading && (
              <Grid
                height="80"
                width="80"
                color="#1c1c1c"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperStyle={{ position: "absolute", top: "50%", left: "50%", transform:"translate(-50%,-50%)",backgroundColor:"white" }}
                wrapperClass=""
                visible={true}
              />
            )}
            <IFrame iframeRef={iframeRef} style={iframeStyle} />
          </div>
        </div>
      </ResizableBox>
    </div>
  );
};

export default CodeCell;
