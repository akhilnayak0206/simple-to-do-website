import { ON_EDIT_TASK, ON_ADD_TASK, ON_DELETE_TASK } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ON_ADD_TASK:
      return [...state, payload];
    case ON_DELETE_TASK: {
      state = state.filter((obj) => {
        return obj.id !== payload.id;
      });
      return [...state];
    }
    case ON_EDIT_TASK: {
      for (let i = 0; i < state.length; i++) {
        if (state[i].id === payload.id) {
          state[i] = payload;
          break;
        }
      }
      return [...state];
    }
    default:
      return state;
  }
}
