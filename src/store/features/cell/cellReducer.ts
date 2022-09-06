import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ActionType } from "../../action-types/action-types";
// import * as allActions from '../../actions/actions';
// import shortUUID from 'short-uuid';
import { v4 as uuid } from "uuid";

export interface CellState {
  loading: boolean;
  error: string | null;
  order: any[];
  data: {
    [key: string]: {
      id: any;
      content: string;
      type: string;
      bundle: {
        code: string;
        err: string;
      };
      index: number;
    };
  };
}

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
      const index = state.data[id].index;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > (state.order.length - 1)) {
        return;
      }
      state.data[id].index = targetIndex;
      state.order[index] = state.order[targetIndex];
      state.data[state.order[index]].index = index;
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
        index: index + 1,
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
        index: state.order.length,
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
        index = state.order.length - 1;
      } else {
        state.order.splice(index, 0, cell.id);
      }
      cell.index = index;
      state.data[cell.id] = cell;
    },
  },
});

// Action creators are generated for each case reducer function
export const actions = cellSlice.actions;

export default cellSlice.reducer;
