import React, { Component } from 'react';
import Store from "context/store";
import axios from 'axios';
import { Row, Col, message } from 'antd';
import { IncomeInput, IncomeTable, CategoryTable, CategoryInput } from 'components/income'
import moment from 'moment';
import PropTypes from 'prop-types';
// import IncomeTable from './IncomeTable';

class IncomeContainer extends Component {

  getCategory = () => { // get income category list
    axios.get('/api/income/category')
      .then(res =>
        this.setState(prev => (
          {
            createData: {
              ...prev.createData,
              category: res.data[0].id
            },
            categoryList: res.data,
          }
        ))
      )
  }

  getList = () => {
    const { thisMonth } = this.state
    axios.post('/api/income/list', { thisMonth })
      .then(res => (
        this.setState({
          data: res.data,
          sumData: [{
            income: res.data.filter(data => data.type === 'income').map(data => data.sum).reduce((a, b) => (a + b), 0).toFixed(2),
            expense: res.data.filter(data => data.type === 'expense').map(data => data.sum).reduce((a, b) => (a + b), 0).toFixed(2),
            difference: (res.data.filter(data => data.type === 'income').map(data => data.sum).reduce((a, b) => (a + b), 0).toFixed(2) - res.data.filter(data => data.type === 'expense').map(data => data.sum).reduce((a, b) => (a + b), 0).toFixed(2)).toFixed(2),
            key: 'sumData'
          }]
        })
      ))
  }

  setList = (data) => {
    axios.post('/api/income/item', { data })
      .then((res) => {
        if (res.data.errno) {
          message.error('Error! check your data.')
        } else {
          this.setState(data => {
            return {
              ...data,
              createData: {
                ...data.createData,
                description: '',
                sum: '',
              }
            }
          })
          this.getList()
          message.success('Success! data added.')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  setCategory = (data) => {
    axios.post('/api/income/category', { data })
      .then(res => {
        if (res.data.errno) {
          message.error('Error! check your data.')
        } else {
          this.setState({ category: '' }, () => {
            this.getCategory()
          })
          message.success('Success! category added.')
        }
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
  }

  removeList = (id) => { // remove item
    axios.post('/api/income/remove', { id: id })
      .then((res) => {
        if (res.data.errno) {
          message.error('Error! check your data.')
        } else {
          this.getList()
          message.success('Success! data removed.')
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  removeCategory = (id) => { // remove category item
    if (this.state.categoryList.length < 2) {
      message.error('Error! you had only 1 category.')
    } else {
      axios.post('/api/income/category/remove', { id: id })
        .then((res) => {
          if (res.data.errno) {
            message.error('Error! check your data.')
          } else {
            this.getCategory()
            message.success('Success! category removed.')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  modifyCategory = (data) => {
    console.log('modifyCategory')
    console.log(data)
    axios.post('/api/income/category/modify', { name: data.name, id: data.id })
        .then((res) => {
          if (res.data.errno) {
            console.log(res)
            message.error('Error! check your data.')
          } else {
            console.log(res)
            this.getCategory()
            this.getList()
            message.success('Success! category modified.')
            data.target.handleCancel(data.id)
          }
        })
        .catch((err) => {
          console.log(err)
        })
  }

  handleCreate = () => {
    const { createData } = this.state
    this.setList(createData)
  }

  handleDate = (value) => { // date input change
    this.setState(data => {
      return {
        ...data,
        createData: {
          ...data.createData,
          date: moment(value).unix()
        }
      }
    })
  }

  handleOption = (value, opt) => {  // type change
    this.setState(data => {
      return {
        ...data,
        createData: {
          ...data.createData,
          type: value
        }
      }
    })
  }

  handleCategory = (value, opt) => {  // category change
    this.setState(data => {
      return {
        ...data,
        createData: {
          ...data.createData,
          category: value
        }
      }
    })
  }

  handleInput = (e) => { //  input change
    const value = e.target.value
    this.setState(data => {
      return {
        ...data,
        createData: {
          ...data.createData,
          description: value
        }
      }
    })
  }

  handleInputNumber = (value) => { //  inputNumber change
    this.setState(data => {
      return {
        ...data,
        createData: {
          ...data.createData,
          sum: value
        }
      }
    })
  }

  handleModal = () => {
    this.setState({ visible: !this.state.visible })
  }

  handleRemove = (id) => {
    this.removeList(id)
  }

  handleMonth = (date, string) => {
    if (date) {
      this.setState({ thisMonth: date })
    }
  }

  handleMonthChange = (m) => {
    const changedMonth = moment(this.state.thisMonth).add(m, 'M')
    this.setState(
      { thisMonth: changedMonth },
      () => {
        this.handleMonth(changedMonth)
      })
  }

  handleCategoryInput = (e) => {
    this.setState({ category: e.target.value })
    // this.setCategory(value)
  }

  handleCreateCategory = () => {
    this.setCategory(this.state.category)
  }

  handleCategoryRemove = (id) => {
    this.removeCategory(id)
  }

  handleCategoryModify = (name, id, parents) => {
    const data = {
      name: name,
      id: id,
      target: parents
    }
    this.modifyCategory(data)
  }

  constructor(props) {
    super(props)

    this.state = {
      data: [],
      sumData: [{
        'income': 0,
        'expense': 0,
        'difference': 0,
        'key': 'sumData'
      }],
      thisMonth: moment().date(1).date(1).hour(0).minute(0).second(0),
      visible: false, // Modal
      createData: {
        date: moment().unix(),
        type: 'expense',
        category: '',
        description: '',
        sum: ''
      },
      category: '',
      categoryList: [],
      firstCategory: '',
      handleDate: this.handleDate,
      handleOption: this.handleOption,
      handleInput: this.handleInput,
      handleInputNumber: this.handleInputNumber,
      handleCategory: this.handleCategory,
      handleCreate: this.handleCreate,
      handleModal: this.handleModal,
      handleRemove: this.handleRemove,
      handleMonth: this.handleMonth,
      handleMonthChange: this.handleMonthChange,
      handleCategoryInput: this.handleCategoryInput,
      handleCreateCategory: this.handleCreateCategory,
      handleCategoryRemove: this.handleCategoryRemove,
      handleCategoryModify: this.handleCategoryModify,
    }
  }

  componentDidMount = () => {
    this.getList()
    this.getCategory()
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.thisMonth !== this.state.thisMonth) {
      this.getList()
    }
  }

  render() {
    return (
      <Store.Provider value={this.state}>
        <Row>
          <Col span={16}>
            {/* income list and data input */}
            <IncomeInput />
            <IncomeTable />
          </Col>
          <Col span={8}>
            {/* category config and graph data */}
            <CategoryInput />
            <CategoryTable />
          </Col>
        </Row >
      </Store.Provider>
    )
  }
}

export default IncomeContainer;

IncomeContainer.proptypes = {
  data: PropTypes.object,
  sumData: PropTypes.array,
  visible: PropTypes.boolean,
  createData: PropTypes.shape({
    date: PropTypes.string,
    type: PropTypes.number,
    category: PropTypes.number,
    description: PropTypes.string,
    sum: PropTypes.number,
  }),
  category: PropTypes.string,
  categoryList: PropTypes.object,
  firstCategory: PropTypes.number,
  handleDate: PropTypes.func,
  handleOption: PropTypes.func,
  handleInput: PropTypes.func,
  handleInputNumber: PropTypes.func,
  handleCategory: PropTypes.func,
  handleCreate: PropTypes.func,
}