import { ON_EDIT_TASK } from './types';

const OnEdit = (data) => (dispatch) => {
  return dispatch({
    type: ON_EDIT_TASK,
    payload: data,
  });
};

export default OnEdit;
