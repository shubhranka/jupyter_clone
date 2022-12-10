import { createAction } from "@reduxjs/toolkit";
import { ActionType } from "../action-types/action-types";
// import { Action } from "../actions/actions";
import * as actions from "../actions/actions";
export const moveCell = createAction(
  ActionType.MOVE_CELL,
  (id: string, direction: "up" | "down"): actions.MoveCellAction => ({
    payload: {
      id,
      direction,
    },
  })
);

export const deleteCell = createAction(
  ActionType.DELETE_CELL,
  (id: string) : actions.DeleteCellAction => ({
    payload: id,
  })
);

export const insertCellAfter = createAction(
  ActionType.INSERT_CELL_AFTER,
  (id: string | null, type: "code" | "text") : actions.InsertCellAfterAction => ({
    payload: {
      id,
      type, 
    },
  })
);

export const updateCell = createAction(
  ActionType.UPDATE_CELL,
  (id: string, content: string) : actions.UpdateCellAction => ({
    payload: {
      id,
      content,
    },
  })
);

export const bundleStart = createAction(
  ActionType.BUNDLE_START,
  (cellId: string) : actions.BundleStartAction => ({
    payload: {
      cellId,
    },
  })
);

export const bundleComplete = createAction(
  ActionType.BUNDLE_COMPLETE,
  (
    cellId: string,
    bundle: {
      code: string;
      err: string;
    }
  ) : actions.BundleCompleteAction => ({
    payload: {
      cellId,
      bundle,
    },
  })
);

// Language: typescript
