import React from 'react';
import { Row, Col } from 'antd';
import styled from 'styled-components';

const IntroBox = styled.div`
  background-color: black;
    opacity: 0.8;
    width: 75%;
    margin: auto;
    border-radius: 10px;
    color: white;
    text-align: center;
    padding-top: 0.1rem;
    white-space: normal;

  h1 {
    font-size: 3em;
    color: white;
  }
  hr {
    border-top: 3px solid white;
    width: 50%;
    margin: auto;
  }

  p {
    color: white;
    font-size: 1.2rem;
    padding: 1rem;
  }
`
const Intro = () => {
  return (
    <Row type="flex" justify="space-around" align="middle" style={{height: '40px', top:0, bottom: 0, marginTop: 'auto', marginBottom: 'auto'}}>
      <Col span={24}>
        <IntroBox>
          <h1>Development</h1>
          <hr />
          <p>React | React(Context) | NodeJS | Express | Ant Design | MariaDB</p>
        </IntroBox>
      </Col>
    </Row>
  );
};

export default Intro;