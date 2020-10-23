import React, { useState, useEffect } from 'react';

// style
import '../App.css';

// ant design ui
import {
  Button,
  Input,
  Menu,
  Dropdown,
  message,
  Modal,
  DatePicker,
} from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import moment from 'moment';

// redux
import { connect } from 'react-redux';
// actions
import { OnAdd } from '../actions/actions';

const { TextArea } = Input;

const AddTaskButton = ({ OnAdd, task }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [addTask, setAddTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'none',
    createdAt: '',
    currentState: 'open',
  });

  useEffect(() => {
    if (task.some((element) => element.title === addTask.title)) {
      setModalVisible(false);
      setAddTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'none',
        createdAt: '',
        currentState: 'open',
      });
      setModalLoading(false);
      message.success('Task created successfully');
    }
    // eslint-disable-next-line
  }, [task]);

  const onTitleChange = (e) => {
    setAddTask((prevState) => ({
      ...prevState,
      title: e.target.value,
    }));
  };

  const onDescriptionChange = (e) => {
    setAddTask((prevState) => ({
      ...prevState,
      description: e.target.value,
    }));
  };

  const onDueDateChange = (e, dateString) => {
    setAddTask((prevState) => ({
      ...prevState,
      dueDate: dateString,
    }));
  };

  function handleMenuClick(e) {
    setAddTask((prevState) => ({
      ...prevState,
      priority: e.key,
    }));
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='none'>None</Menu.Item>
      <Menu.Item key='low'>Low</Menu.Item>
      <Menu.Item key='medium'>Medium</Menu.Item>
      <Menu.Item key='high'>High</Menu.Item>
    </Menu>
  );

  const handleSaveModal = () => {
    if (addTask.title.length < 10) {
      message.error('Please enter Title more than 10 characters');
    }
    if (addTask.description.length < 10) {
      message.error('Please enter Description more than 10 characters');
    }
    if (addTask.description.length > 9 && addTask.title.length > 9) {
      let currentDate = new Date(Date.now());
      let formattedDate = currentDate.toLocaleDateString('en-IN');
      let dataToAdd = {
        ...addTask,
        id: Date.now().toString(),
        createdAt: formattedDate,
        currentState: 'open',
      };
      setModalLoading(true);
      OnAdd(dataToAdd);
    }
  };

  return (
    <>
      <Button
        type='primary'
        shape='circle'
        size='large'
        icon={<PlusOutlined />}
        onClick={(e) => setModalVisible(true)}
      />
      <Modal
        title='Add Task'
        visible={modalVisible}
        onOk={handleSaveModal}
        onCancel={() => setModalVisible(false)}
        confirmLoading={modalLoading}
        footer={[
          <Button
            key='back'
            type='ghost'
            onClick={() => setModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button key='submit' type='primary' onClick={handleSaveModal}>
            Save
          </Button>,
        ]}
        className='addTaskModal'
      >
        <p>Title</p>
        <Input
          placeholder='Add title here'
          allowClear
          onChange={onTitleChange}
          maxLength={140}
          value={addTask.title}
        />
        <p>Description</p>
        <TextArea
          placeholder='Add Description Here'
          allowClear
          onChange={onDescriptionChange}
          maxLength={500}
          value={addTask.description}
        />
        <div className='addTaskModalSingleRow'>
          <div className='dueDateAddModal'>
            <p>Due Date</p>
            <DatePicker
              format={'DD/MM/YYYY'}
              onChange={onDueDateChange}
              value={
                addTask.dueDate ? moment(addTask.dueDate, 'DD/MM/YYYY') : ''
              }
            />
          </div>
          <div className='priorityAddModal'>
            <p>Priority</p>
            <Dropdown.Button overlay={menu} icon={<DownOutlined />}>
              {addTask.priority ? addTask.priority : 'Select Priority'}
            </Dropdown.Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({ task: state.task });

export default connect(mapStateToProps, { OnAdd })(AddTaskButton);
