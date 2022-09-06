import React from "react";
import "./index.css";
import { useDispatch } from "react-redux";
import { actions } from "../../store/features/cell/cellReducer";

interface AddNewButtonProps {
  id: string;
}
const AddNewButton: React.FC<AddNewButtonProps> = ({ id }) => {
  const dispatch = useDispatch();
  return (
    <div className="button_background_container">
      <div className="line"></div>
      <div className="button_container">
        <div
          onClick={() => {
                 dispatch(actions.insert_cell_after({ id, type: "code" }));
          }}
        >
          Code
        </div>
        <div
          onClick={() => {
            dispatch(actions.insert_cell_after({ id, type: "text" }));
          }}
        >
          Text
        </div>
      </div>
    </div>
  );
};

export default AddNewButton;
