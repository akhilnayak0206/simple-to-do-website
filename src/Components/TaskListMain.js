import React from 'react';
// ant design
import { Tabs } from 'antd';
// redux
import { connect } from 'react-redux';
// actions
import { OnFilterTask } from '../actions/actions';
import AllTask from './AllTask';

const { TabPane } = Tabs;

const TaskListMain = ({ OnFilterTask }) => {
  const callback = (key) => {
    OnFilterTask({ currentStatus: key, groupBy: 'none', search: '' });
  };
  return (
    <Tabs defaultActiveKey='all' onChange={callback} style={{ width: '100%' }}>
      <TabPane tab='All' key='all'>
        <AllTask />
      </TabPane>
      <TabPane tab='Pending' key='pending'>
        <AllTask />
      </TabPane>
      <TabPane tab='Completed' key='completed'>
        <AllTask />
      </TabPane>
    </Tabs>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { OnFilterTask })(TaskListMain);
