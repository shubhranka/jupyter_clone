import { useEffect, useRef, useState } from "react";
import esbuildWasm from "esbuild-wasm";
const App:React.FC = () => {

    const [initialized, setInitialized] = useState(false);
    const [input, setInput] = useState<string>('');
    const [code, setCode] = useState<string>('');

    useEffect(()=>{
        (async ()=>{
            await esbuildWasm.initialize({
                wasmURL: '/esbuild.wasm'
            });
            setInitialized(true);
        })()
        console.log("hello");
    },[])
    return (
        <div>
         <textarea onChange={(e)=>setInput(e.target.value)} value={input}></textarea>
         <button onClick={ async()=>{
            if(!initialized)
                return
            const data = await esbuildWasm.transform(input,{
                loader:"tsx",
                target:"es2015",
            })
            setCode(data.code);
         }}>Submit</button>
         <pre>{code}</pre>
        </div>
    );
}

export default App;