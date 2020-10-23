import { ON_FILTER_TASK } from './types';

const OnFilterTask = (payload) => (dispatch) => {
  return dispatch({
    type: ON_FILTER_TASK,
    payload,
  });
};

export default OnFilterTask;
