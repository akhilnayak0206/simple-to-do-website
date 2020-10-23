import React, { Fragment, useEffect, useState } from 'react'; // eslint-disable-line

// styles
import '../App.css';

import {
  ColumnHeightOutlined,
  EditOutlined,
  DownOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

// redux
import { connect } from 'react-redux';
// actions
import { OnEdit, OnFilterTask, OnDelete } from '../actions/actions';
// ant design
import {
  Menu,
  Dropdown,
  message,
  Button,
  Popconfirm,
  Input,
  Modal,
  DatePicker,
} from 'antd';
import moment from 'moment';
import ShowModalView from './ShowModalView';
const { TextArea } = Input;

const AllTask = ({ filteredTask, OnEdit, OnFilterTask, task, OnDelete }) => {
  const [listTask, setListTask] = useState([]);
  const [summarySort, setSummarySort] = useState(true);
  const [prioritySort, setPrioritySort] = useState(true);
  const [createdOnSort, setCreatedOnSort] = useState(true);
  const [dueBySort, setDueBySort] = useState(true);
  const [groupByPrevState, setGroupByPrevState] = useState('');
  const [groupArray, setGroupArray] = useState([]);
  const [searchPrevState, setSearchPrevState] = useState('');
  const [currentStatusPrevState, setCurrentStatusPrevState] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [editModalObj, setEditModalObj] = useState({});

  //   sort task based on all pending completed
  useEffect(() => {
    if (filteredTask.currentStatus === 'pending') {
      let allTask = task.filter((e) => e.currentState === 'open');
      let sortedTask = allTask.sort((a, b) => Number(b.id) - Number(a.id));
      setListTask(sortedTask);
    } else if (filteredTask.currentStatus === 'completed') {
      let allTask = task.filter((e) => e.currentState === 'done');
      let sortedTask = allTask.sort((a, b) => Number(b.id) - Number(a.id));
      setListTask(sortedTask);
    } else {
      let sortedTask = task.sort((a, b) => Number(b.id) - Number(a.id));
      setListTask(sortedTask);
    }
    if (editModal && task.some((element) => element.id === editModalObj.id)) {
      setEditModal(false);
      setEditModalObj({});
      message.success('Task saved successfully');
    }
    // eslint-disable-next-line
  }, [task]);

  //   filtered task
  useEffect(() => {
    if (filteredTask.groupBy !== groupByPrevState) {
      if (filteredTask.groupBy === 'createdOn') {
        let allHeaderArray = [];
        task.map((t) => allHeaderArray.push(t.createdAt));
        let sortedTask = allHeaderArray.sort((a, b) => {
          let aa = a.split('/').reverse().join(),
            bb = b.split('/').reverse().join();
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
        let uniq = [...new Set(sortedTask)];
        setGroupArray(uniq);
      }
      if (filteredTask.groupBy === 'pending') {
        let allHeaderArray = [];
        task.map((t) => allHeaderArray.push(t.dueDate));
        let sortedTask = allHeaderArray.sort((a, b) => {
          let aa = a.split('/').reverse().join(),
            bb = b.split('/').reverse().join();
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
        let uniq = [...new Set(sortedTask)];
        setGroupArray(uniq);
      }
      if (filteredTask.groupBy === 'priority') {
        setGroupArray(['high', 'medium', 'low', 'none']);
      }
      setGroupByPrevState(filteredTask.groupBy);
    }
    if (filteredTask.search !== searchPrevState) {
      if (filteredTask.search) {
        let sortedTask = task.filter((e) => {
          if (
            e.title.indexOf(filteredTask.search) !== -1 ||
            e.priority.indexOf(filteredTask.search) !== -1 ||
            e.description.indexOf(filteredTask.search) !== -1
          ) {
            return true;
          } else {
            return false;
          }
        });
        setListTask(sortedTask);
        setSearchPrevState(filteredTask.search);
      } else {
        let sortedTask = task.sort((a, b) => Number(b.id) - Number(a.id));
        setListTask(sortedTask);
        setSearchPrevState(filteredTask.search);
      }
    }
    if (filteredTask.currentStatus !== currentStatusPrevState) {
      if (filteredTask.currentStatus === 'pending') {
        let allTask = task.filter((e) => e.currentState === 'open');
        let sortedTask = allTask.sort((a, b) => Number(b.id) - Number(a.id));
        setListTask(sortedTask);
      } else if (filteredTask.currentStatus === 'completed') {
        let allTask = task.filter((e) => e.currentState === 'done');
        let sortedTask = allTask.sort((a, b) => Number(b.id) - Number(a.id));
        setListTask(sortedTask);
      } else {
        let sortedTask = task.sort((a, b) => Number(b.id) - Number(a.id));
        setListTask(sortedTask);
      }
      setCurrentStatusPrevState(filteredTask.currentStatus);
    }
    // eslint-disable-next-line
  }, [filteredTask]);

  const onSorting = (val) => {
    OnFilterTask({ groupBy: 'none', search: '' });
    if (val.sortVar === 'summary') {
      if (summarySort) {
        let sortedTask = task.sort((a, b) => a.title.localeCompare(b.title));
        setListTask(sortedTask);
        setSummarySort((prevState) => !prevState);
      } else {
        let sortedTask = task.sort((a, b) => b.title.localeCompare(a.title));
        setListTask(sortedTask);
        setSummarySort((prevState) => !prevState);
      }
    }
    if (val.sortVar === 'priority') {
      if (prioritySort) {
        let sortedTask = task.sort((a, b) => {
          let aa =
            a.priority === 'none'
              ? 1
              : a.priority === 'low'
              ? 2
              : a.priority === 'medium'
              ? 3
              : 4;
          let bb =
            b.priority === 'none'
              ? 1
              : b.priority === 'low'
              ? 2
              : b.priority === 'medium'
              ? 3
              : 4;
          return aa - bb;
        });
        setListTask(sortedTask);
        setPrioritySort((prevState) => !prevState);
      } else {
        let sortedTask = task.sort((a, b) => {
          let aa =
            a.priority === 'none'
              ? 1
              : a.priority === 'low'
              ? 2
              : a.priority === 'medium'
              ? 3
              : 4;
          let bb =
            b.priority === 'none'
              ? 1
              : b.priority === 'low'
              ? 2
              : b.priority === 'medium'
              ? 3
              : 4;
          return bb - aa;
        });
        setListTask(sortedTask);
        setPrioritySort((prevState) => !prevState);
      }
    }
    if (val.sortVar === 'createdOn') {
      if (createdOnSort) {
        let sortedTask = task.sort((a, b) => {
          let aa = a.createdAt.split('/').reverse().join(),
            bb = b.createdAt.split('/').reverse().join();
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
        setListTask(sortedTask);
        setCreatedOnSort((prevState) => !prevState);
      } else {
        let sortedTask = task.sort((a, b) => {
          let aa = a.createdAt.split('/').reverse().join(),
            bb = b.createdAt.split('/').reverse().join();
          return aa > bb ? -1 : aa < bb ? 1 : 0;
        });
        setListTask(sortedTask);
        setCreatedOnSort((prevState) => !prevState);
      }
    }
    if (val.sortVar === 'dueBy') {
      if (dueBySort) {
        let sortedTask = task.sort((a, b) => {
          let aa = a.dueDate.split('/').reverse().join(),
            bb = b.dueDate.split('/').reverse().join();
          return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
        setListTask(sortedTask);
        setDueBySort((prevState) => !prevState);
      } else {
        let sortedTask = task.sort((a, b) => {
          let aa = a.dueDate.split('/').reverse().join(),
            bb = b.dueDate.split('/').reverse().join();
          return aa > bb ? -1 : aa < bb ? 1 : 0;
        });
        setListTask(sortedTask);
        setDueBySort((prevState) => !prevState);
      }
    }
  };

  //   for edit task priority menu
  function handleMenuClick(e) {
    setEditModalObj((prevState) => ({
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

  return (
    <>
      <Modal
        title='Show Task'
        visible={showViewModal}
        onOk={() => {
          setShowViewModal(false);
          setSelectedTask({});
        }}
        onCancel={() => {
          setShowViewModal(false);
          setSelectedTask({});
        }}
      >
        <ShowModalView taskProps={selectedTask} />
      </Modal>
      <table style={{ width: '100%' }}>
        <tr>
          <th>
            <div className='flexCorner'>
              Summary
              <Button
                type='primary'
                icon={<ColumnHeightOutlined />}
                onClick={() => onSorting({ sortVar: 'summary' })}
              />
            </div>
          </th>
          <th>
            <div className='flexCorner'>
              Priority
              <Button
                type='primary'
                icon={<ColumnHeightOutlined />}
                onClick={() => onSorting({ sortVar: 'priority' })}
              />
            </div>
          </th>
          <th>
            <div className='flexCorner'>
              Created On
              <Button
                type='primary'
                icon={<ColumnHeightOutlined />}
                onClick={() => onSorting({ sortVar: 'createdOn' })}
              />
            </div>
          </th>
          <th>
            <div className='flexCorner'>
              Due By
              <Button
                type='primary'
                icon={<ColumnHeightOutlined />}
                onClick={() => onSorting({ sortVar: 'dueBy' })}
              />
            </div>
          </th>
          <th>
            <div className='flexCorner'>Actions</div>
          </th>
        </tr>
        {groupByPrevState === 'none' || ''
          ? listTask.map((element, key) => (
              <tr
                key={key}
                style={
                  element.currentState === 'done'
                    ? { textDecoration: 'line-through' }
                    : {}
                }
              >
                <td
                  onClick={() => {
                    setShowViewModal(true);
                    setSelectedTask(element);
                  }}
                >
                  {element.title}
                </td>
                <td
                  onClick={() => {
                    setShowViewModal(true);
                    setSelectedTask(element);
                  }}
                >
                  {element.priority}
                </td>
                <td
                  onClick={() => {
                    setShowViewModal(true);
                    setSelectedTask(element);
                  }}
                >
                  {element.createdAt}
                </td>
                <td
                  onClick={() => {
                    setShowViewModal(true);
                    setSelectedTask(element);
                  }}
                >
                  {element.dueDate}
                </td>
                <td>
                  <div className='flexEvenly'>
                    <Modal
                      title='Edit Task'
                      visible={editModal}
                      onOk={() => OnEdit({ ...editModalObj })}
                      onCancel={() => setEditModal(false)}
                      footer={[
                        <Button
                          key='back'
                          type='ghost'
                          onClick={() => setEditModal(false)}
                        >
                          Cancel
                        </Button>,
                        <Button
                          key='submit'
                          type='primary'
                          onClick={() => OnEdit({ ...editModalObj })}
                        >
                          Save
                        </Button>,
                      ]}
                      className='addTaskModal'
                    >
                      <p>Title</p>
                      <Input
                        allowClear
                        onChange={(e) =>
                          setEditModalObj((prevState) => ({
                            ...prevState,
                            title: e.target.value,
                          }))
                        }
                        maxLength={140}
                        value={editModalObj.title}
                      />
                      <p>Description</p>
                      <TextArea
                        placeholder='Add Description Here'
                        allowClear
                        onChange={(e) =>
                          setEditModalObj((prevState) => ({
                            ...prevState,
                            description: e.target.value,
                          }))
                        }
                        maxLength={500}
                        value={editModalObj.description}
                      />
                      <div className='addTaskModalSingleRow'>
                        <div className='dueDateAddModal'>
                          <p>Due Date</p>
                          <DatePicker
                            format={'DD/MM/YYYY'}
                            onChange={(e, dateString) =>
                              setEditModalObj((prevState) => ({
                                ...prevState,
                                dueDate: dateString,
                              }))
                            }
                            value={
                              editModalObj.dueDate
                                ? moment(editModalObj.dueDate, 'DD/MM/YYYY')
                                : ''
                            }
                          />
                        </div>
                        <div className='priorityAddModal'>
                          <p>Priority</p>
                          <Dropdown.Button
                            overlay={menu}
                            icon={<DownOutlined />}
                          >
                            {editModalObj.priority
                              ? editModalObj.priority
                              : 'Select Priority'}
                          </Dropdown.Button>
                        </div>
                      </div>
                    </Modal>
                    <Button
                      type='primary'
                      icon={<EditOutlined />}
                      onClick={() => {
                        setEditModalObj({ ...element });
                        setEditModal(true);
                      }}
                    />
                    {element.currentState === 'done' ? (
                      <Button
                        style={{ backgroundColor: '#0079ba', color: 'white' }}
                        shape='round'
                        onClick={() =>
                          OnEdit({ ...element, currentState: 'open' })
                        }
                      >
                        Re-open
                      </Button>
                    ) : (
                      <Button
                        style={{ backgroundColor: '#00c932', color: 'white' }}
                        shape='round'
                        onClick={() =>
                          OnEdit({ ...element, currentState: 'done' })
                        }
                      >
                        Done
                      </Button>
                    )}
                    <Popconfirm
                      title='Are you sure delete this task?'
                      onConfirm={() => OnDelete(element)}
                      okText='Yes'
                      cancelText='No'
                    >
                      <Button type='danger' icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </div>
                </td>
              </tr>
            ))
          : groupArray.map((groupHeader, k) => (
              <Fragment key={k}>
                <tr className='textAlignCenter'>
                  <td className='borderRight0'></td>
                  <td className='border0'></td>
                  <td className='border0 fontBold textUnderline'>
                    {groupHeader}
                  </td>
                  <td className='border0'></td>
                  <td className='borderLeft0'></td>
                </tr>
                {groupByPrevState === 'priority'
                  ? listTask.map((element, key) =>
                      element.priority === groupHeader ? (
                        <tr
                          key={key}
                          style={
                            element.currentState === 'done'
                              ? { textDecoration: 'line-through' }
                              : {}
                          }
                        >
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.title}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.priority}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.createdAt}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.dueDate}
                          </td>
                          <td>
                            <div className='flexEvenly'>
                              <Modal
                                title='Edit Task'
                                visible={editModal}
                                onOk={() => OnEdit({ ...editModalObj })}
                                onCancel={() => setEditModal(false)}
                                footer={[
                                  <Button
                                    key='back'
                                    type='ghost'
                                    onClick={() => setEditModal(false)}
                                  >
                                    Cancel
                                  </Button>,
                                  <Button
                                    key='submit'
                                    type='primary'
                                    onClick={() => OnEdit({ ...editModalObj })}
                                  >
                                    Save
                                  </Button>,
                                ]}
                                className='addTaskModal'
                              >
                                <p>Title</p>
                                <Input
                                  allowClear
                                  onChange={(e) =>
                                    setEditModalObj((prevState) => ({
                                      ...prevState,
                                      title: e.target.value,
                                    }))
                                  }
                                  maxLength={140}
                                  value={editModalObj.title}
                                />
                                <p>Description</p>
                                <TextArea
                                  placeholder='Add Description Here'
                                  allowClear
                                  onChange={(e) =>
                                    setEditModalObj((prevState) => ({
                                      ...prevState,
                                      description: e.target.value,
                                    }))
                                  }
                                  maxLength={500}
                                  value={editModalObj.description}
                                />
                                <div className='addTaskModalSingleRow'>
                                  <div className='dueDateAddModal'>
                                    <p>Due Date</p>
                                    <DatePicker
                                      format={'DD/MM/YYYY'}
                                      onChange={(e, dateString) =>
                                        setEditModalObj((prevState) => ({
                                          ...prevState,
                                          dueDate: dateString,
                                        }))
                                      }
                                      value={
                                        editModalObj.dueDate
                                          ? moment(
                                              editModalObj.dueDate,
                                              'DD/MM/YYYY'
                                            )
                                          : ''
                                      }
                                    />
                                  </div>
                                  <div className='priorityAddModal'>
                                    <p>Priority</p>
                                    <Dropdown.Button
                                      overlay={menu}
                                      icon={<DownOutlined />}
                                    >
                                      {editModalObj.priority
                                        ? editModalObj.priority
                                        : 'Select Priority'}
                                    </Dropdown.Button>
                                  </div>
                                </div>
                              </Modal>
                              <Button
                                type='primary'
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditModalObj({ ...element });
                                  setEditModal(true);
                                }}
                              />
                              {element.currentState === 'done' ? (
                                <Button
                                  style={{
                                    backgroundColor: '#0079ba',
                                    color: 'white',
                                  }}
                                  shape='round'
                                  onClick={() =>
                                    OnEdit({ ...element, currentState: 'open' })
                                  }
                                >
                                  Re-open
                                </Button>
                              ) : (
                                <Button
                                  style={{
                                    backgroundColor: '#00c932',
                                    color: 'white',
                                  }}
                                  shape='round'
                                  onClick={() =>
                                    OnEdit({ ...element, currentState: 'done' })
                                  }
                                >
                                  Done
                                </Button>
                              )}
                              <Popconfirm
                                title='Are you sure delete this task?'
                                onConfirm={() => OnDelete(element)}
                                okText='Yes'
                                cancelText='No'
                              >
                                <Button
                                  type='danger'
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )
                  : groupByPrevState === 'createdOn'
                  ? listTask.map((element, key) =>
                      element.createdAt === groupHeader ? (
                        <tr
                          key={key}
                          style={
                            element.currentState === 'done'
                              ? { textDecoration: 'line-through' }
                              : {}
                          }
                        >
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.title}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.priority}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.createdAt}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.dueDate}
                          </td>
                          <td>
                            <div className='flexEvenly'>
                              <Modal
                                title='Edit Task'
                                visible={editModal}
                                onOk={() => OnEdit({ ...editModalObj })}
                                onCancel={() => setEditModal(false)}
                                footer={[
                                  <Button
                                    key='back'
                                    type='ghost'
                                    onClick={() => setEditModal(false)}
                                  >
                                    Cancel
                                  </Button>,
                                  <Button
                                    key='submit'
                                    type='primary'
                                    onClick={() => OnEdit({ ...editModalObj })}
                                  >
                                    Save
                                  </Button>,
                                ]}
                                className='addTaskModal'
                              >
                                <p>Title</p>
                                <Input
                                  allowClear
                                  onChange={(e) =>
                                    setEditModalObj((prevState) => ({
                                      ...prevState,
                                      title: e.target.value,
                                    }))
                                  }
                                  maxLength={140}
                                  value={editModalObj.title}
                                />
                                <p>Description</p>
                                <TextArea
                                  placeholder='Add Description Here'
                                  allowClear
                                  onChange={(e) =>
                                    setEditModalObj((prevState) => ({
                                      ...prevState,
                                      description: e.target.value,
                                    }))
                                  }
                                  maxLength={500}
                                  value={editModalObj.description}
                                />
                                <div className='addTaskModalSingleRow'>
                                  <div className='dueDateAddModal'>
                                    <p>Due Date</p>
                                    <DatePicker
                                      format={'DD/MM/YYYY'}
                                      onChange={(e, dateString) =>
                                        setEditModalObj((prevState) => ({
                                          ...prevState,
                                          dueDate: dateString,
                                        }))
                                      }
                                      value={
                                        editModalObj.dueDate
                                          ? moment(
                                              editModalObj.dueDate,
                                              'DD/MM/YYYY'
                                            )
                                          : ''
                                      }
                                    />
                                  </div>
                                  <div className='priorityAddModal'>
                                    <p>Priority</p>
                                    <Dropdown.Button
                                      overlay={menu}
                                      icon={<DownOutlined />}
                                    >
                                      {editModalObj.priority
                                        ? editModalObj.priority
                                        : 'Select Priority'}
                                    </Dropdown.Button>
                                  </div>
                                </div>
                              </Modal>
                              <Button
                                type='primary'
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditModalObj({ ...element });
                                  setEditModal(true);
                                }}
                              />
                              {element.currentState === 'done' ? (
                                <Button
                                  style={{
                                    backgroundColor: '#0079ba',
                                    color: 'white',
                                  }}
                                  shape='round'
                                  onClick={() =>
                                    OnEdit({ ...element, currentState: 'open' })
                                  }
                                >
                                  Re-open
                                </Button>
                              ) : (
                                <Button
                                  style={{
                                    backgroundColor: '#00c932',
                                    color: 'white',
                                  }}
                                  shape='round'
                                  onClick={() =>
                                    OnEdit({ ...element, currentState: 'done' })
                                  }
                                >
                                  Done
                                </Button>
                              )}
                              <Popconfirm
                                title='Are you sure delete this task?'
                                onConfirm={() => OnDelete(element)}
                                okText='Yes'
                                cancelText='No'
                              >
                                <Button
                                  type='danger'
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )
                  : listTask.map((element, key) =>
                      element.dueDate === groupHeader ? (
                        <tr
                          key={key}
                          style={
                            element.currentState === 'done'
                              ? { textDecoration: 'line-through' }
                              : {}
                          }
                        >
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.title}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.priority}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.createdAt}
                          </td>
                          <td
                            onClick={() => {
                              setShowViewModal(true);
                              setSelectedTask(element);
                            }}
                          >
                            {element.dueDate}
                          </td>
                          <td>
                            <div className='flexEvenly'>
                              <Modal
                                title='Edit Task'
                                visible={editModal}
                                onOk={() => OnEdit({ ...editModalObj })}
                                onCancel={() => setEditModal(false)}
                                footer={[
                                  <Button
                                    key='back'
                                    type='ghost'
                                    onClick={() => setEditModal(false)}
                                  >
                                    Cancel
                                  </Button>,
                                  <Button
                                    key='submit'
                                    type='primary'
                                    onClick={() => OnEdit({ ...editModalObj })}
                                  >
                                    Save
                                  </Button>,
                                ]}
                                className='addTaskModal'
                              >
                                <p>Title</p>
                                <Input
                                  allowClear
                                  onChange={(e) =>
                                    setEditModalObj((prevState) => ({
                                      ...prevState,
                                      title: e.target.value,
                                    }))
                                  }
                                  maxLength={140}
                                  value={editModalObj.title}
                                />
                                <p>Description</p>
                                <TextArea
                                  placeholder='Add Description Here'
                                  allowClear
                                  onChange={(e) =>
                                    setEditModalObj((prevState) => ({
                                      ...prevState,
                                      description: e.target.value,
                                    }))
                                  }
                                  maxLength={500}
                                  value={editModalObj.description}
                                />
                                <div className='addTaskModalSingleRow'>
                                  <div className='dueDateAddModal'>
                                    <p>Due Date</p>
                                    <DatePicker
                                      format={'DD/MM/YYYY'}
                                      onChange={(e, dateString) =>
                                        setEditModalObj((prevState) => ({
                                          ...prevState,
                                          dueDate: dateString,
                                        }))
                                      }
                                      value={
                                        editModalObj.dueDate
                                          ? moment(
                                              editModalObj.dueDate,
                                              'DD/MM/YYYY'
                                            )
                                          : ''
                                      }
                                    />
                                  </div>
                                  <div className='priorityAddModal'>
                                    <p>Priority</p>
                                    <Dropdown.Button
                                      overlay={menu}
                                      icon={<DownOutlined />}
                                    >
                                      {editModalObj.priority
                                        ? editModalObj.priority
                                        : 'Select Priority'}
                                    </Dropdown.Button>
                                  </div>
                                </div>
                              </Modal>
                              <Button
                                type='primary'
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setEditModalObj({ ...element });
                                  setEditModal(true);
                                }}
                              />
                              {element.currentState === 'done' ? (
                                <Button
                                  style={{
                                    backgroundColor: '#0079ba',
                                    color: 'white',
                                  }}
                                  shape='round'
                                  onClick={() =>
                                    OnEdit({ ...element, currentState: 'open' })
                                  }
                                >
                                  Re-open
                                </Button>
                              ) : (
                                <Button
                                  style={{
                                    backgroundColor: '#00c932',
                                    color: 'white',
                                  }}
                                  shape='round'
                                  onClick={() =>
                                    OnEdit({ ...element, currentState: 'done' })
                                  }
                                >
                                  Done
                                </Button>
                              )}
                              <Popconfirm
                                title='Are you sure delete this task?'
                                onConfirm={() => OnDelete(element)}
                                okText='Yes'
                                cancelText='No'
                              >
                                <Button
                                  type='danger'
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </div>
                          </td>
                        </tr>
                      ) : null
                    )}
              </Fragment>
            ))}
      </table>
    </>
  );
};

const mapStateToProps = (state) => ({
  filteredTask: state.filteredTask,
  task: state.task,
});

export default connect(mapStateToProps, { OnEdit, OnFilterTask, OnDelete })(
  AllTask
);
