import { ON_ADD_TASK } from './types';

const OnAdd = (data) => (dispatch) => {
  return dispatch({
    type: ON_ADD_TASK,
    payload: data,
  });
};

export default OnAdd;
