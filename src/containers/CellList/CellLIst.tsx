import { useSelector } from "react-redux";
import CodeCell from "../../components/CodeCell/CodeCell";
import TextEditor from "../../components/TextEditor/TextEditor";
import { RootState } from "../../store/store";
import CellContainer from "../CellContainer";
const CellList = () => {
  const cells = useSelector((state: RootState) =>
    state.cellReducer.order.map((id) => state.cellReducer.data[id])
  );
  // const cellData = useSelector((state: RootState) => state.cellReducer.data);
  // console.log(cells);
  const state = useSelector((state: RootState) => state.cellReducer);
  // console.log(state);
  return (
    <div>
      {cells.map((cell) => {
        return <CellContainer key={cell.id} type={cell.type} data={cell}/>
      })}
    </div>
  );
};

export default CellList;
