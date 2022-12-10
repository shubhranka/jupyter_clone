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
import AddNewButton from "../../components/AddNewButton";
interface CellContainerProps {
  type: string;
  data: any;
}
const CellContainer: React.FC<CellContainerProps> = ({ type, data }) => {
  const dispatch = useDispatch();
  const style:any = {}
  if(type === 'text'){
    style['backgroundColor'] = '#fff';
    style['color'] = '#1c1c1c';
  }else{
    style['backgroundColor'] = '#1c1c1c';
    style['color'] = '#fff';
  }
  return (
    <div className="cell_list_cell_container">
      <div className="top_buttons">
        <span style={style}
          className="up_button"
          onClick={() => {
            dispatch(actions.move_cell({ id: data.id, direction: "up" }));
          }}
        >
          <AiOutlineArrowUp />
        </span>
        <span style={style}
          className="down_button"
          onClick={() => {
            dispatch(actions.move_cell({ id: data.id, direction: "down" }));
          }}
        >
          <AiOutlineArrowDown />
        </span>
        <span style={style}
          className="close_button"
          onClick={() => {
            dispatch(actions.delete_cell(data.id));
          }}
        >
          <AiOutlineClose />    
        </span>
      </div>
      {type === "code" ? <CodeCell cellData={data} /> : <TextEditor />}

      <AddNewButton id={data.id}/>
    </div>
  );
};

export default CellContainer;
