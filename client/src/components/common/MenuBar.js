import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';


class MenuBar extends Component {
  render() {
    const { location } = this.props;
    return (
      <div>
        <Menu
          theme='dark'
          onClick={this.handleClick}
          selectedKeys={[location.pathname]}
          mode="inline"
        >
          <Menu.Item key="/">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/income">
            <Link to="/income">Income Management</Link>
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default MenuBar;