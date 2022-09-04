import CodeCell from "./components/CodeCell/CodeCell";
import TextEditor from "./components/TextEditor/TextEditor";
const App: React.FC = () => {
  return <div>
          <CodeCell></CodeCell>
          <TextEditor></TextEditor>
          <CodeCell></CodeCell>
        </div>
};

export default App;
