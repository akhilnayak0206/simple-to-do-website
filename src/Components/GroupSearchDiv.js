import React from 'react';

//styles
import '../App.css';

// ant design ui
import { Input, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

// redux
import { connect } from 'react-redux';
// actions
import { OnFilterTask } from '../actions/actions';

const GroupSearchDiv = ({ OnFilterTask, filteredTask }) => {
  const handleMenuClick = (e) => {
    OnFilterTask({ groupBy: e.key });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key='none'>None</Menu.Item>
      <Menu.Item key='createdOn'>Created On</Menu.Item>
      <Menu.Item key='pending'>Pending On</Menu.Item>
      <Menu.Item key='priority'>Priority</Menu.Item>
    </Menu>
  );

  return (
    <>
      <div className='groupByDiv'>
        <h4>Group By</h4>
        <Dropdown.Button overlay={menu} icon={<DownOutlined />}>
          {filteredTask.groupBy
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, function (str) {
              return str.toUpperCase();
            })}
        </Dropdown.Button>
      </div>
      <div className='searchBarDiv'>
        <h4>Search</h4>
        <Input
          placeholder='Search Tasks'
          value={filteredTask.search}
          allowClear
          onChange={(e) => OnFilterTask({ search: e.target.value })}
        />
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({ filteredTask: state.filteredTask });

export default connect(mapStateToProps, { OnFilterTask })(GroupSearchDiv);
