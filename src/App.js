import React from 'react';
import { Provider } from 'react-redux';

//Redux
import store from './store';

// styles
import './App.css';

//Components
import GroupSearchDiv from './Components/GroupSearchDiv';
import TaskListMain from './Components/TaskListMain';
import AddTaskButton from './Components/AddTaskButton';

const App = () => {
  return (
    <Provider store={store}>
      <div className='App'>
        <div className='header'>
          <h1>ToDo App</h1>
          <AddTaskButton />
        </div>
        <div className='textBoxDiv'>
          <GroupSearchDiv />
        </div>
        <div className='taskListMainDiv'>
          <TaskListMain />
        </div>
      </div>
    </Provider>
  );
};

export default App;
