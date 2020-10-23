import { combineReducers } from 'redux';
import task from './task';
import filteredTask from './filteredTask';

export default combineReducers({
  task,
  filteredTask,
});
