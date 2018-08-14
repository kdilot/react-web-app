import React, { Component } from 'react';
import Store from "context/store";
import axios from 'axios';
import { Row, Col } from 'antd';
import { IncomeInput, IncomeTable } from 'components/income'
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
      })
      .catch((err) => {
        console.log(err)
      })
  }

  removeList = (id) => { // remove item
    axios.post('/api/income/remove', { id: id })
      .then((res) => {
        this.getList()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  handleCreate = (form) => {
    form.preventDefault()
    console.log(form)
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
        date: '',
        type: '',
        category: '',
        description: '',
        sum: ''
      },
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
      test: this.test,
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
          <Col span={12}>
            {/* income list and data input */}
            <IncomeInput />
            <IncomeTable />
          </Col>
          <Col span={12}>
            {/* category config and graph data */}
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
  categoryList: PropTypes.object,
  firstCategory: PropTypes.number,
  handleDate: PropTypes.func,
  handleOption: PropTypes.func,
  handleInput: PropTypes.func,
  handleInputNumber: PropTypes.func,
  handleCategory: PropTypes.func,
  handleCreate: PropTypes.func,
}