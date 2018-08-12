import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';

const SubMenu = Menu.SubMenu;

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
          <Menu.Item key="/test">
            <Link to="/test">test</Link>
          </Menu.Item>
          <Menu.Item key="/home">
            <Link to="/home">Project Home</Link>
          </Menu.Item>
          <SubMenu key="sub1" title={<span>Example Pages</span>}>
            <Menu.Item key="/income">
            <Link to="/income">Income Management</Link>
            </Menu.Item>
            <Menu.Item key="/income2">
            <Link to="/income2">Income Management</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default MenuBar;