import AddNewButton from "./components/AddNewButton";
import CellList from "./containers/CellList/CellLIst";
import { bundleAction } from "./store/features/bundle/bundleReducer";
import { useAppDispatch } from "./store/store";

const App: React.FC = () => {
  // const dispatch = useAppDispatch()
  // dispatch(bundleAction(",%"));
  return (
    <div>
      <AddNewButton id=""></AddNewButton> */
      <CellList />
    </div>
  );
};

export default App;
