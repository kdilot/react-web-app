import React from 'react';
import Store from "context/store";
import { Row, Col, Input, Button } from 'antd';

const CategoryInput = () => {
  return (
    <Store.Consumer>
      {store => {
        return (
          <Row>
            <Col span={24} style={{ textAlign: 'center', padding: '1em', display: store.categoryFlag }}>
              <Row>
                <Col span={18}>
                  <Input style={{ width: '100%' }} value={store.category} placeholder="Category" onChange={store.handleCategoryInput} />
                </Col>
                <Col span={6}>
                  <Button type="primary" icon="check" onClick={store.handleCreateCategory}>Add</Button>
                </Col>
              </Row>
            </Col>
          </Row>
        )
      }}
    </Store.Consumer>
  );
};

export default CategoryInput;