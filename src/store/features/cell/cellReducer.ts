import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ActionType } from "../../action-types/action-types";
// import * as allActions from '../../actions/actions';
// import shortUUID from 'short-uuid';
import { v4 as uuid } from "uuid";

export interface CellData{
    id: string;
    content: string;
    type: string;
};

interface CellStateData{
    [key:string]:CellData
}

export interface CellState {
  loading: boolean;
  error: string | null;
  order: any[];
  data: CellStateData
};

const initialState: CellState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

export const cellSlice = createSlice({
  name: "cellReducer",
  initialState,
  reducers: {
    [ActionType.UPDATE_CELL]: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    [ActionType.DELETE_CELL]: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.data[id];
      state.order = state.order.filter((item) => item !== id);
    },
    [ActionType.MOVE_CELL]: (
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down" }>
    ) => {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((item) => item === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > (state.order.length - 1)) {
        return;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = id;
    },
    [ActionType.INSERT_CELL_AFTER]: (
      state,
      action: PayloadAction<{ id: string | null; type: string }>
    ) => {
      const { id, type } = action.payload;
      const index = state.order.findIndex((item) => item === id);
      const cell = {
        id: uuid(),
        content: "",
        type,
        bundle: {
          code: "",
          err: "",
        },
      };
      state.data[cell.id] = cell;
      if (index < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(index + 1, 0, cell.id);
      }
    },
    [ActionType.ADD_CELL]: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      const cell = {
        id: uuid(),
        content: "",
        type,
        bundle: {
          code: "",
          err: "",
        },
      };
      state.data[cell.id] = cell;
      state.order.push(cell.id);
    },
    [ActionType.INSERT_CELL_BEFORE]: (
      state,
      action: PayloadAction<{ id: string | null; type: string }>
    ) => {
      const { id, type } = action.payload;
      let index = state.order.findIndex((item) => item === id);
      const cell:any = {
        id: uuid(),
        content: "",
        type,
        bundle: {
          code: "",
          err: "",
        },
      };
      if (index < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(index, 0, cell.id);
      }
      state.data[cell.id] = cell;
    },
  },
});

// Action creators are generated for each case reducer function
export const actions = cellSlice.actions;

export default cellSlice.reducer;
