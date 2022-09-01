import MonacoEditor from '@monaco-editor/react';
import { useEffect } from 'react';

const Editor = (props:any) => {
    return <MonacoEditor height="500px" theme='vs-dark' language='javascript' width="200px" 
    onChange={props.onChange}
    onMount={(editor:any,monaco:any)=>{
        console.log(editor,monaco);
        editor.onKeyDown(async (e:any)=>{
            // console.log(e);
            // if(e.ctrlKey && e.altKey && e.code == "KeyF")
            // console.log("keydown");

            if(e.ctrlKey && e.altKey && e.code == "Enter"){
                // console.log("submit")
                // console.log(props)
                await props.onSubmitHandle();
            }
        });
        // editor.focus();
        // if(monaco){
        //     console.log(monaco);
        //     editor.registerCommand(monaco.KeyCode.F9, () => {
        //         console.log("hello");
        //     })
        // }
    }}
    options={{
        wordWrap: 'on',
        minimap: {
            enabled: false
        },
        folding: false,
        lineNumbersMinChars:3,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
    }
    }
    />
}

export default Editor;