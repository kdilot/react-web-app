import React from 'react';
import Store from 'context/store';
import { Button, Row, Col, DatePicker, Table, Popconfirm } from 'antd';
import styled from 'styled-components';

const { MonthPicker } = DatePicker
const Wrapper = styled.div`
  tbody .in {
    color: #61D1F7
  }

  tbody .out {
    color: #FC96AE
  }

  .summery {
    font-weight: bold
  }
`

const IncomeTable = () => {

  const columns = [{
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
    align: 'center',
    width: '12%',
  }, {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: '12%',
  }, {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    align: 'center',
    width: '15%',
  }, {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    align: 'center',
    width: '41%',
  }, {
    title: 'Sum',
    dataIndex: 'sum',
    key: 'sum',
    align: 'center',
    sorter: (a, b) => a.sum - b.sum,
    width: '10%',
  }, {
    title: 'Action',
    dataIndex: '',
    key: 'x',
    align: 'center',
    width: '10%',
    render: (text, record, index) =>
      <Store.Consumer>
        {store => {
          return (
            <div>
              <Popconfirm title="Sure to remove?" onConfirm={() => { store.handleRemove(record.key) }}>
                <Button type="danger" size="small">Remove</Button>
              </Popconfirm>
            </div >
          )
        }}
      </Store.Consumer>
  }]

  const sumColumns = [{
    title: 'Income Total',
    dataIndex: 'income',
    key: 'income',
    className: 'in',
    align: 'center',
  }, {
    title: 'Expense Total',
    dataIndex: 'expense',
    key: 'expense',
    className: 'out',
    align: 'center',
  }, {
    title: 'Money Difference',
    dataIndex: 'difference',
    key: 'difference',
    align: 'center',
  }]

  return (
    <Store.Consumer>
      {store => {
        return (
          <Row>
            <Wrapper>
              <Row>
                <Row>
                  <Col span={24} style={{ textAlign: 'center', padding: '1em' }}>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Button type="primary" shape="circle" icon="arrow-left" onClick={() => { store.handleMonthChange(-1) }} />
                    </Col>
                    <Col span={12}>
                      <MonthPicker placeholder="Select month" defaultValue={store.thisMonth} value={store.thisMonth} onChange={store.handleMonth} />
                    </Col>
                    <Col span={6} style={{ textAlign: 'left' }}>
                      <Button type="primary" shape="circle" icon="arrow-right" onClick={() => { store.handleMonthChange(1) }} />
                    </Col>
                  </Col>
                </Row>

                <Row>
                  <Col span={24} style={{ textAlign: 'center', padding: '1em' }}>
                    <Table columns={columns} dataSource={store.data} pagination={{ pageSize: 15 }} size="small" scroll={{ x: 800 }} />
                  </Col>
                </Row>
              </Row>
              <br />
              <Row>
                <Col span={24}>
                  <Table columns={sumColumns} dataSource={store.sumData} pagination={{ hideOnSinglePage: true }} className="summery" scroll={{ x: 800 }} />
                </Col>
              </Row>
            </Wrapper>
          </Row>
        )
      }}
    </Store.Consumer>
  );
};

export default IncomeTable;