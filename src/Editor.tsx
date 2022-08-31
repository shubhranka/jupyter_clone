import MonacoEditor from '@monaco-editor/react';

const Editor = () => {
    return <MonacoEditor height="500px" theme='vs-dark' language='javascript' width="200px" 
    onChange={(e)=>console.log(e)}
    options={{
        wordWrap: 'on',
        minimap: {
            enabled: false
        },
        folding: false,
        lineNumbersMinChars:3,
        scrollBeyondLastLine: false,
        automaticLayout: true,
    }
    }
    />
}

export default Editor;