import { ON_DELETE_TASK } from './types';

const OnDelete = (payload) => (dispatch) => {
  dispatch({
    type: ON_DELETE_TASK,
    payload,
  });
};

export default OnDelete;
