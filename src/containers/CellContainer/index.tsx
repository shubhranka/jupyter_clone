import React from "react";
import CodeCell from "../../components/CodeCell/CodeCell";
import TextEditor from "../../components/TextEditor/TextEditor";
import "./index.css";
import {
  AiOutlineArrowUp,
  AiOutlineArrowDown,
  AiOutlineClose,
} from "react-icons/ai";
import { useDispatch } from "react-redux";
import { actions } from "../../store/features/cell/cellReducer";
interface CellContainerProps {
  type: string;
  data: any;
}
const CellContainer: React.FC<CellContainerProps> = ({ type, data }) => {
  const dispatch = useDispatch();
  return (
    <div className="cell_list_cell_container">
      <div className="top_buttons">
        <span
          className="up_button"
          onClick={() => {
            dispatch(actions.move_cell({ id: data.id, direction: "up" }));
          }}
        >
          <AiOutlineArrowUp />
        </span>
        <span
          className="down_button"
          onClick={() => {
            dispatch(actions.move_cell({ id: data.id, direction: "down" }));
          }}
        >
          <AiOutlineArrowDown />
        </span>
        <span
          className="close_button"
          onClick={() => {
            dispatch(actions.delete_cell(data.id));
          }}
        >
          <AiOutlineClose />    
        </span>
      </div>
      {type === "code" ? <CodeCell cellData={data} /> : <TextEditor />}
    </div>
  );
};

export default CellContainer;
