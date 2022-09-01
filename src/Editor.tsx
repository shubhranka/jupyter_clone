import MonacoEditor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
export type Monaco = typeof monaco;
interface EditorProps {
    // onChangeHandler: (value: string | undefined) => void;
    onSubmitHandle: (inp:string) => void;
}
const Editor : React.FC<EditorProps> = ({onSubmitHandle}) => {
    return <MonacoEditor height="500px" theme='vs-dark' language='javascript' 
    onMount={(editor:any,monaco:Monaco)=>{
        // console.log(editor,monaco);

        editor.addAction({
            id: 'my-unique-id',
            label: 'My First Action',
            keybindings: [
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter | monaco.KeyMod.Alt,
            ],
            run: function(ed:any) {
                console.log('My First Action was triggered');
                onSubmitHandle(editor.getValue());
                return null;
            }
        });
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