import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CellContainer from "../CellContainer";
const CellList = () => {
  const cells = useSelector((state: RootState) =>
    state.cellReducer.order.map((id) => state.cellReducer.data[id])
  );
  // const cellData = useSelector((state: RootState) => state.cellReducer.data);
  // console.log(cells);
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
