import MonacoEditor from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
export type Monaco = typeof monaco;
interface EditorProps {
  // onChangeHandler: (value: string | undefined) => void;
  onSubmitHandle: (inp: string) => void;
    // editorRef: any
}
let timer:any;
const Editor: React.FC<EditorProps> = ({ onSubmitHandle }) => {
  return (
    <MonacoEditor
      theme="vs-dark"
      language="javascript"
      onChange={(value) => {

        if(timer)
        clearTimeout(timer);

        timer = setTimeout(() => {
          onSubmitHandle(value as string);
        }, 1000);
      
      }}
      onMount={(editor: any, monaco: Monaco) => {
        // console.log(editor,monaco);

        editor.addAction({
          id: "my-unique-id",
          label: "My First Action",
          keybindings: [
            monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter | monaco.KeyMod.Alt,
          ],
          run: function (ed: any) {
            console.log("My First Action was triggered");
            onSubmitHandle(editor.getValue());
            return null;
          },
        });
      }}
      options={{
        wordWrap: "on",
        minimap: {
          enabled: false,
        },
        folding: false,
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        formatOnPaste: true,
        formatOnType: true,
        tabSize: 2,
        scrollbar:{
            verticalScrollbarSize: 0,
        }
      }}
    />
  );
};

export default Editor;
