import React from 'react';

// style
import '../App.css';

// ant design ui
import { Input, Dropdown, DatePicker } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TextArea } = Input;

const ShowModalView = ({ taskProps }) => {
  return (
    <div className='addTaskModal'>
      <p>Title</p>
      <Input
        placeholder='Add title here'
        maxLength={140}
        value={taskProps.title}
        disabled
      />
      <p>Description</p>
      <TextArea
        placeholder='Add Description Here'
        maxLength={500}
        value={taskProps.description}
        disabled
      />
      <div className='addTaskModalSingleRow'>
        <div className='dueDateAddModal'>
          <p>Due Date</p>
          <DatePicker
            format={'DD/MM/YYYY'}
            value={
              taskProps.dueDate ? moment(taskProps.dueDate, 'DD/MM/YYYY') : ''
            }
            disabled
          />
        </div>
        <div className='priorityAddModal'>
          <p>Priority</p>
          <Dropdown.Button icon={<DownOutlined />} disabled>
            {taskProps.priority}
          </Dropdown.Button>
        </div>
      </div>
    </div>
  );
};

export default ShowModalView;
