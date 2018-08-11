import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import { MenuBar, Intro } from 'components/common';
import IncomeTable from 'components/income/IncomeTable';
import { Home, List } from 'pages';
import { Layout } from 'antd';
import styled from 'styled-components';

const { Header, Footer, Sider, Content } = Layout;
const Logo = styled.div`
  height: 32px;
  background: rgba(255,255,255,.2);
  margin: 16px;
`;

class App extends Component {
  render() {
    return (
      <Layout style={{height:"100vh"}}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          // onBreakpoint={(broken) => { console.log(broken); }}
          // onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
        >
          <Logo />
          <Route path='/' component={MenuBar} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ paddingTop: '5em' }} >
            <Switch>
              <Route exact path='/' component={Intro} />
              <Route path='/home' component={Home} />
              <Route path='/list' component={List} />
              <Route path='/income' component={IncomeTable} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            RK DEV ©2018 Created by R.Kang
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;