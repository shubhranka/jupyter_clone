import React from 'react'
import "./index.css"
import { useDispatch } from 'react-redux';
import { actions } from '../../store/features/cell/cellReducer';
const AddNewButton:React.FC = () => {
    const dispatch = useDispatch();
    return (
        <div className='button_container'>
            <div onClick={()=>{
                dispatch(actions.add_cell("code"))
            }}>Code</div>
            <div onClick={()=>{
                dispatch(actions.add_cell("text"))
            }}>Text</div>
        </div>
    )
}

export default AddNewButton