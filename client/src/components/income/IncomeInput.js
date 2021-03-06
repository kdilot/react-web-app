import React from 'react';
import Store from "context/store";
import { Row, Col, DatePicker, Select, Input, InputNumber, Button} from 'antd';
import moment from 'moment';

const { Option } = Select;

const IncomeInput = () => {
  return (
    <Store.Consumer>
      {store => {
        return (
          <Row>
            <Col span={24}  style={{ textAlign: 'center', padding: '1em' }}>
              <Col span={4}>
                <DatePicker style={{ width: '100%' }} defaultValue={moment()} onChange={store.handleDate} />
              </Col>
              <Col span={4}>
                <Select style={{ width: '100%' }} placeholder="Type" defaultValue="expense" value={store.createData.type} onChange={store.handleOption}>
                  <Option value="expense">Expense</Option>
                  <Option value="income">Income</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select style={{ width: '100%' }} placeholder="Category" value={store.createData.category} onChange={store.handleCategory}>
                  {
                    store.categoryList.map(
                      (list) => <Option key={list.id} value={list.id}>{list.name}</Option>
                    )
                  }
                </Select>
              </Col>
              <Col span={6}>
                <Input style={{ width: '100%' }} value={store.createData.description} placeholder="Description" onChange={store.handleInput} />
              </Col>
              <Col span={3}>
                <InputNumber style={{ width: '100%' }} value={store.createData.sum} placeholder="Sum" precision={2} min={0} onChange={store.handleInputNumber} />
              </Col>
              <Col span={3}>
                <Button type="primary" icon="check" onClick={store.handleCreate}>Add</Button>
              </Col>
            </Col>
          </Row>
        )
      }}
    </Store.Consumer>
  );
}

export default IncomeInput;