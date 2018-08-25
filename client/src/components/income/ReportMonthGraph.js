import React from 'react';
import { BarChart, XAxis, Tooltip, YAxis, Bar, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Row, Col } from 'antd';
import Report from "context/report";

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}
const COL_INCOME = ['#61D1F7', '#57C7ED', '#4DBDE3', '#43B3D9', '#39A9CF']
const COL_EXPENSE = ['#FC96AE', '#F28CA4', '#E8829A', '#DE7890', '#D46E84']

const ReportMonthGraph = () => {
  return (
    <Report.Consumer>
      {report => {
        if (report.monthData.length) {
          return (
            <Row style={{ textAlign: 'center', marginTop: '1em' }}>
              <h2>Monthly</h2>
              <Col span={18}>
                <ResponsiveContainer width="100%" height={500}>
                  <BarChart width={100} height={500} data={report.monthData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#61D1F7" />
                    <Bar dataKey="expense" fill="#FC96AE" />
                  </BarChart>
                </ResponsiveContainer>
              </Col>
              <Col span={6}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart width={800} height={250}>
                    <Pie dataKey="value" isAnimationActive={false} data={report.categoryMonthIncome} cx={200} cy={125} outerRadius={100} fill="#8884d8" labelLine={false} label={renderCustomizedLabel} >
                      {
                        (report.categoryMonthIncome).map((entry, index) => <Cell key={index} fill={COL_INCOME[index % COL_INCOME.length]} />)
                      }
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart width={800} height={250}>
                    <Pie dataKey="value" isAnimationActive={false} data={report.categoryMonthExpense} cx={200} cy={125} outerRadius={100} fill="#8884d8" labelLine={false} label={renderCustomizedLabel} >
                      {
                        (report.categoryMonthExpense).map((entry, index) => <Cell key={index} fill={COL_EXPENSE[index % COL_EXPENSE.length]} />)
                      }
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Col>
            </Row>
          )
        }
      }}
    </Report.Consumer>
  );
};

export default ReportMonthGraph;