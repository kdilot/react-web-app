import React, { Component } from 'react';
import Store from 'context/store';
import { Row, Col, Table, Button, Popconfirm, Input, Modal } from 'antd';
import PropTypes from 'prop-types';

class CategoryTable extends Component {

  showModal = (record) => {
    this.setState({
      visible: {
        ...this.state.visible,
        [record.key]: true
      },
      categoryName: record.name
    })
  }

  handleCancel = (key) => {
    this.setState({
      visible: {
        ...this.state.visible,
        [key]: false
      },
      categoryName: ''
    })
  }

  handleModal = (e) => {
    this.setState({
      categoryName: e.target.value
    })
  }

  constructor(props) {
    super(props)

    this.state = {
      visible: {},
      data: '',
      categoryName: '',
      columns: [{
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: '55%'
      }, {
        title: 'Action',
        dataIndex: '',
        key: 'x',
        align: 'center',
        width: '45%',
        render: (text, record, index) =>
          <Store.Consumer>
            {store => {
              return (
                <Row>
                  <Button type="primary" size="small" onClick={() => { this.showModal(record) }} style={{ margin: '0.2em' }}>Modify</Button>
                  {this.state.visible[record.key] ?
                    <Modal
                      title="Modify Category Name"
                      visible={this.state.visible[record.key]}
                      onOk={() => { store.handleCategoryModify(this.state.categoryName, record.key, this) }}
                      onCancel={() => { this.handleCancel(record.key) }}
                    >
                      <Input defaultValue={record.name} onChange={this.handleModal} />
                    </Modal>
                    : ''}
                  <Popconfirm title="Sure to remove?" onConfirm={() => { store.handleCategoryRemove(record.key) }}>
                    <Button type="danger" size="small" style={{ margin: '0.2em' }}>Remove</Button>
                  </Popconfirm>
                </Row>
              )
            }}
          </Store.Consumer>
      }]
    }
  }

  render() {
    return (
      <Store.Consumer>
        {store => {
          return (
            <Row>
              <Col span={24} style={{ padding: '1em', display: store.categoryFlag }}>
                <Table columns={this.state.columns} dataSource={store.categoryList} pagination={{ hideOnSinglePage: true }} rowClassName='editable-row' />
              </Col>
            </Row>
          )
        }}
      </Store.Consumer>
    );
  };
}
export default CategoryTable;

CategoryTable.proptypes = {
  visible: PropTypes.object,
  data: PropTypes.array,
  categoryName: PropTypes.array,
}
