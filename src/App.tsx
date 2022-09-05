import CodeCell from "./components/CodeCell/CodeCell";
import TextEditor from "./components/TextEditor/TextEditor";

import { useSelector,useDispatch, } from "react-redux";
import { RootState } from "./store/store";
import { actions } from "./store/features/cell/cellReducer";
import { useEffect } from "react";



const App: React.FC = () => {


  return <div>
          <CodeCell></CodeCell>
          <TextEditor></TextEditor>
          <CodeCell></CodeCell>
        </div>
};

export default App;
