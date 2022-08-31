import { useEffect, useRef, useState } from "react";
import esbuildWasm from "esbuild-wasm";
import { unpkgPathPlugin } from "./unpkgPlugin";
import Editor from "./Editor";
const App:React.FC = () => {

    const [initialized, setInitialized] = useState(false);
    const [input, setInput] = useState<string>('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const onSubmitListener = async()=>{
        if(!initialized)
            return
        
        if(iframeRef.current)
        iframeRef.current.srcdoc = 
        `
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
        const data = await esbuildWasm.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            define:{
                'process.env.NODE_ENV': '"development"',
                global: 'window'
            },
            plugins: [unpkgPathPlugin(input)]
        })
        // console.log(data.outputFiles[0].text);
        // setCode(data.outputFiles[0].text);


        if(iframeRef.current?.contentWindow){
            iframeRef.current.contentWindow.postMessage(data.outputFiles[0].text, '*');
        }
     }
    useEffect(()=>{
        (async ()=>{
            if(!initialized)
            try{
                await esbuildWasm.initialize({
                    wasmURL: "https://unpkg.com/esbuild-wasm@0.15.5/esbuild.wasm"
                });
            }catch(e){
                console.error(e);
            }
            setInitialized(true);
        })()
        // console.log("hello");
    },[initialized])
    return (
        <div>
        <Editor/>
         <textarea onChange={(e)=>setInput(e.target.value)} value={input} onKeyUp={e=>{
                if(e.key === 'Enter' && e.ctrlKey){
                    onSubmitListener();
                }
         }}></textarea>
         <button onClick={ onSubmitListener }>Submit</button>
         <iframe ref={iframeRef} sandbox="allow-scripts" title="myIframe"></iframe>
        </div>
    );
}

export default App;