import React, { Component } from 'react';
import Report from "context/report";
import axios from 'axios';
import { Row, Col } from 'antd';
import { ReportMonthGraph, ReportYearGraph } from 'components/income'
import moment from 'moment';
import PropTypes from 'prop-types';

class ReportContainer extends Component {

  /*
this.state = {
 itemList: [{
   _id: 1234,
   description: 'This the description',
   amount: 100
 }, {
   _id: 1234,
   description: 'This the description',
   amount: 100
 }],
}

this.setState(prevState => ({
 itemList: prevState.itemList.map(
   obj => (obj._id === 1234 ? Object.assign(obj, { description: "New Description" }) : obj)
 )
}))
 */

  getReportMonth = () => {
    const { thisMonth, categoryArray } = this.state
    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'income', report: 'M' })
      .then(res => {
        this.setState({
          monthData: res.data.map(
            obj => Object.assign(obj, { income: obj.sum })
          )
        })
      })

    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'expense', report: 'M' })
      .then(res => {
        res.data.forEach(element => {
          this.setState(list => ({
            ...list,
            monthData: list.monthData.map(
              obj => obj.name === element.name ? Object.assign(obj, { expense: element.sum }) : obj
            )
          }))
        })
      })


    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'income', report: 'CM' })
      .then(res => {
        const category = []
        res.data.forEach(element => {
          category.push({ name: categoryArray[element.name], value: element.sum })
        })
        this.setState({ categoryMonthIncome: category })
      })

    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'expense', report: 'CM' })
      .then(res => {
        const category = []
        res.data.forEach(element => {
          category.push({ name: categoryArray[element.name], value: element.sum })
        })
        this.setState({ categoryMonthExpense: category })
      })
  }

  getReportYear = () => {
    const { thisMonth, categoryArray } = this.state
    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'income', report: 'Y' })
      .then(res => {
        this.setState({
          yearData: res.data.map(
            obj => Object.assign(obj, { income: obj.sum })
          )
        })
      })

    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'expense', report: 'Y' })
      .then(res => {
        res.data.forEach(element => {
          this.setState(list => ({
            ...list,
            yearData: list.yearData.map(
              obj => obj.name === element.name ? Object.assign(obj, { expense: element.sum }) : obj
            )
          }))
        })
      })


    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'income', report: 'CY' })
      .then(res => {
        const category = []
        res.data.forEach(element => {
          category.push({ name: categoryArray[element.name], value: element.sum })
        })
        this.setState({ categoryYearIncome: category })
      })

    axios.post('/api/income/report', { thisMonth: thisMonth, type: 'expense', report: 'CY' })
      .then(res => {
        const category = []
        res.data.forEach(element => {
          category.push({ name: categoryArray[element.name], value: element.sum })
        })
        this.setState({ categoryYearExpense: category })
      })
  }

  getReport = () => {
    this.getReportYear()
    this.getReportMonth()
  }

  setCategory = () => {
    const { categoryList } = this.state
    let categoryArray = []
    categoryList.forEach(element => {
      categoryArray[element.id] = element.name
    })
    this.setState({ categoryArray })
  }

  constructor(props) {
    super(props)

    this.state = {
      thisYear: moment().month(0).date(1).hour(0).minute(0).second(0),
      thisMonth: this.props.thisMonth,
      categoryList: this.props.categoryList,
      categoryArray: [],
      monthData: [{}],
      categoryYearIncome: [{}],
      categoryYearExpense: [{}],
      categoryMonthIncome: [{}],
      categoryMonthExpense: [{}],
      yearData: [{}],
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setCategory()
    this.setState({ thisMonth: nextProps.thisMonth, categoryList: nextProps.categoryList },
      () => {
        this.getReport()
      })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.categoryList !== this.state.categoryList) {
      this.setCategory()
      this.getReport()
    }
  }

  render() {
    return (
      <Report.Provider value={this.state}>
        <Row>
          <Col span={24}>
            <ReportYearGraph />
            <ReportMonthGraph />
          </Col>
        </Row>
      </Report.Provider>
    )
  }
}

export default ReportContainer;

ReportContainer.proptypes = {
  categoryMonthData: PropTypes.object,
  categoryYearData: PropTypes.object,
  monthData: PropTypes.array,
  yearData: PropTypes.array,
  thisYear: PropTypes.string,
  thisMonth: PropTypes.string,
}