import CodeCell from "./components/CodeCell/CodeCell";
import TextEditor from "./components/TextEditor/TextEditor";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import { actions } from "./store/features/cell/cellReducer";
import { useEffect } from "react";
import AddNewButton from "./components/AddNewButton";
import CellList from "./containers/CellList/CellLIst";

const App: React.FC = () => {
  return (
    <div>
      <CellList />
      <AddNewButton></AddNewButton>
    </div>
  );
};

export default App;
