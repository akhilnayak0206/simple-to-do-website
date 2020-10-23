import { ON_FILTER_TASK } from '../actions/types';

const initialState = { groupBy: 'none', search: '', currentStatus: 'all' };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ON_FILTER_TASK:
      return { ...state, ...payload };
    default:
      return state;
  }
}
