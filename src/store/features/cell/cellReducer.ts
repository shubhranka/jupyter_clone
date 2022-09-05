import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import  {ActionType}  from '../../action-types/action-types';
// import * as allActions from '../../actions/actions';
import shortUUID from 'short-uuid';
class DoubleLinkedListNode {
  constructor(public key: string, public next: DoubleLinkedListNode | null, public prev: DoubleLinkedListNode | null) {}
}

class DoubleLinkedList {
  constructor(public head: DoubleLinkedListNode | null, public tail: DoubleLinkedListNode | null, public length:number) {}

  push(key: string) {
    const node = new DoubleLinkedListNode(key, null, this.tail);
    if (this.tail) {
      this.tail.next = node;
    }
    if (!this.head) {
      this.head = node;
    }
    this.tail = node;
    this.length++;
    return node;
  }

  pushAtTop(key: string) {
    const node = new DoubleLinkedListNode(key, this.head, null);
    if (this.head) {
      this.head.prev = node;
    }
    if (!this.tail) {
      this.tail = node;
    }
    this.head = node;
    this.length++;
    return node;
  }

  pop() {
    if (!this.tail) {
      return null;
    }
    const node = this.tail;
    if (this.tail.prev) {
      this.tail.prev.next = null;
    }
    this.tail = this.tail.prev;
    this.length--;
    return node;
  }

  popAt(node:DoubleLinkedListNode){
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    this.length--;
  }
  pushAfter(key: string, prev: DoubleLinkedListNode) {
    const node = new DoubleLinkedListNode(key, prev.next, prev);
    if (prev.next) {
      prev.next.prev = node;
    }
    prev.next = node;
    this.length++;
    return node;
  }

  // pushBefore(key: string, next: DoubleLinkedListNode) {
  //   const node = new DoubleLinkedListNode(key, next, next.prev);
  //   if (next.prev) {
  //     next.prev.next = node;
  //   }
  //   next.prev = node;
  //   this.length++;
  // }

  shiftRight(node: DoubleLinkedListNode) {
    if (!node.prev) {
      return;
    }
    const prev = node.prev;
    if (prev.prev) {
      prev.prev.next = node;
    }
    node.prev = prev.prev;
    prev.next = node.next;
    if (node.next) {
      node.next.prev = prev;
    }
    prev.prev = node;
    node.next = prev;
  }

  shiftLeft(node: DoubleLinkedListNode) {
    if (!node.next) {
      return;
    }
    const next = node.next;
    if (next.next) {
      next.next.prev = node;
    }
    node.next = next.next;
    next.prev = node.prev;
    if (node.prev) {
      node.prev.next = next;
    }
    next.next = node;
    node.prev = next;
  }

  getAll() {
    const nodes = [];
    let node = this.head;
    while (node) {
      nodes.push(node);
      node = node.next;
    }
    return nodes;
  }

  map(callback: (node: DoubleLinkedListNode) => void) {
    let node = this.head;
    while (node) {
      callback(node);
      node = node.next;
    }
  }
}


export interface CellState {
  loading:boolean;
  error: string | null;
  order: DoubleLinkedList | null;
  data: {
    [key: string]: {
      id: string,
      content: string,
      type: string,
      bundle: {
        code: string;
        err: string;
      }
      order:DoubleLinkedListNode | null
    };
  };
};

const initialState: CellState = {
  loading: false,
  error: null,
  order: null,
  data: {}
};

export const cellSlice = createSlice({
  name: 'cellReducer',
  initialState,
  reducers: {
    [ActionType.UPDATE_CELL]: (state, action: PayloadAction<{id:string,content:string}>) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
    [ActionType.DELETE_CELL]: (state, action: PayloadAction<string>) => {
      const  id  = action.payload;
      delete state.data[id];
      if (state.order) {
        state.order.popAt(state.data[id].order!);
      }
    },
    [ActionType.MOVE_CELL]: (state, action: PayloadAction<{id: string, direction: 'up' | 'down'}>) => {
      const { id, direction } = action.payload;
      if (state.order) {
        const node = state.data[id].order!;
        if (direction === 'up') {
          state.order.shiftLeft(node);
        } else {
          state.order.shiftRight(node);
        }
      }
    },
    [ActionType.INSERT_CELL_AFTER]: (state, action: PayloadAction<{id: string | null, type: string}>) => {
      const { id, type } = action.payload;
      const cell: {
        id: string,
        content: string,
        type: string,
        bundle: {
          code: string;
          err: string;
        }
        order:DoubleLinkedListNode | null
      } = {
        id: shortUUID.generate(),
        content: '',
        type,
        bundle: {
          code: '',
          err: ''
        },
        order: null
      };
      state.data[cell.id] = cell;
      if (state.order) {
        const node = new DoubleLinkedListNode(cell.id, null, null);
        state.data[cell.id].order = node;
        if (id) {
          state.order.pushAfter(cell.id, state.data[id].order!);
        } else {
          state.order.pushAtTop(cell.id);
        }
      }
    },

  },
})

// Action creators are generated for each case reducer function
export const actions = cellSlice.actions

export default cellSlice.reducer