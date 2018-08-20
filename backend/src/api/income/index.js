module.exports = function (app) {
  const express = require('express');
  const route = express.Router();
  const bodyParser = require('body-parser');
  const db = require('config/db')();
  const moment = require('moment');
  app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json());

  // get income list
  route.post('/list', function (req, res) {
    const thisMonth = req.body.thisMonth ? req.body.thisMonth : moment()
    const range = req.body.range ? req.body.range : 0
    const MonthQuery = ` and (date >= ${moment(thisMonth).add(range, 'M').unix()} and date < ${moment(thisMonth).add(range + 1, 'M').unix()})`
    const sql = `SELECT id as 'key', FROM_UNIXTIME(date, '%m/%d/%Y') as date, type, (select name from income_category where id=category) as category, description, sum FROM income_list WHERE display=1 ${MonthQuery}`

    db.query(sql, function (err, rows, fields) {
      if (err) res.json(err)
      res.json(rows)
    })
  })

  // get report list
  route.post('/report', function (req, res) {
    const month = req.body.thisMonth
    // console.log(moment(thisMonth).month(0).date(1).hour(0).minute(0).second(0))
    const thisYear = moment(month).month(0).date(1).hour(0).minute(0).second(0)
    const thisMonth = moment(month).date(1).hour(0).minute(0).second(0)
    const type = req.body.type ? req.body.type : 'income'
    const report = req.body.report

    let sql = ''
    if(report === 'Y') {
      const MonthQuery = `AND (date >= ${moment(thisYear).unix()} and date < ${moment(thisYear).add(1, 'Y').unix()})`
      sql = `SELECT DATE_FORMAT(FROM_UNIXTIME(date),'%Y/%m') month, sum(sum) as sum FROM income_list WHERE display=1 AND type='${type}' ${MonthQuery} GROUP BY month`
    } else if(report === 'M') {
      const MonthQuery = `AND (date >= ${moment(thisMonth).unix()} and date < ${moment(thisMonth).add(1, 'M').unix()})`
      sql = `SELECT DATE_FORMAT(FROM_UNIXTIME(date),'%m/%d') month, sum(sum) as sum FROM income_list WHERE display=1 AND type='${type}' ${MonthQuery} GROUP BY month`
    } else if(report === 'CY') {
      const MonthQuery = `AND (date >= ${moment(thisYear).unix()} and date < ${moment(thisYear).add(1, 'Y').unix()})`
      sql = `SELECT category as name, sum(sum) as sum FROM income_list WHERE display=1 AND type='${type}' ${MonthQuery} GROUP BY category`
    } else if(report === 'CM') {
      const MonthQuery = `AND (date >= ${moment(thisMonth).unix()} and date < ${moment(thisMonth).add(1, 'M').unix()})`
      sql = `SELECT category as name, sum(sum) as sum FROM income_list WHERE display=1 AND type='${type}' ${MonthQuery} GROUP BY category`
    }
    
    db.query(sql, function (err, rows, fields) {
      if (err) res.json(err)
      res.json(rows)
    })
  })

  // get total income or expense sum
  route.post('/sum', function (req, res) {
    const sql = `SELECT sum(sum) as ${req.body.type} FROM income_list WHERE type='${req.body.type}'`
    db.query(sql, function (err, rows, fields) {
      res.json(rows[0])
      // console.log(rows)
    })
  })

  // remove list 
  route.post('/remove', function (req, res) {
    const sql = `UPDATE income_list SET display=0 WHERE id=${req.body.id}`
    db.query(sql, function (err, rows, fields) {
      if (err) res.json(err)
      res.json(rows)
    })
  })

  // remove category list 
  route.post('/category/remove', function (req, res) {
    const sql = `UPDATE income_category SET display=0 WHERE id=${req.body.id}`
    db.query(sql, function (err, rows, fields) {
      if (err) res.json(err)
      res.json(rows)
    })
  })

  // modify category name 
  route.post('/category/modify', function (req, res) {
    const sql = `UPDATE income_category SET name='${req.body.name}' WHERE id=${req.body.id}`
    db.query(sql, function (err, rows, fields) {
      if (err) res.json(err)
      res.json(rows)
    })
  })

  // set income data
  route.post('/item', function (req, res) {
    const param = req.body.data
    const sql = 'INSERT INTO income_list SET ?'
    const data = {
      date: param.date,
      type: param.type,
      category: param.category,
      description: param.description,
      sum: param.sum
    }
    db.query(sql, data, function (err, result) {
      if (err) res.json(err)
      res.json(result)
    })
  })

  // set category data
  route.post('/category', function (req, res) {
    const sql = 'INSERT INTO income_category SET ?'
    const data = {
      name: req.body.data
    }
    db.query(sql, data, function (err, result) {
      if (err) res.json(err)
      res.json(result)
    })
  })

  //  get income category list
  route.get('/category', function (req, res) {
    const sql = "SELECT id, name, id as 'key' FROM income_category WHERE display=1"
    db.query(sql, function (err, rows) {
      if (err) res.json(err)
      res.json(rows)
    })
  })

  // route.post('/category', function (req, res) {
  //   const sql = 'INSERT INTO income_category SET ?'
  //   const data = {
  //     date: req.body.date,
  //     type: req.body.type,
  //     category: req.body.category,
  //     description: req.body.description,
  //     sum: req.body.sum
  //   }
  //   db.query(sql, data, function (err, result) {
  //     if (err) res.json(err)
  //     res.json(result)
  //   })
  // })


  //  test query
  route.get('/test', function (req, res) {
    const _default = 1514793600

    for (i = 1; i <= 1000; i++) {
      const data = {
        date: Math.round(Math.random() * 31449600) + _default,
        type: (i <= 700 ? 'expense' : 'income'),
        category: Math.round(Math.random() * 4) + 1,
        description: `Sample Data ${i}`,
        sum: (i <= 700 ? (Math.random() * 200).toFixed(2) : (Math.random() * 700).toFixed(2))
      }

      const sql = 'INSERT INTO income_list SET ?'

      db.query(sql, data, function (err, result) {
        // if (err) res.json(err)
        // res.json(result)
      })
    }
    res.json('test')
  })




  return route;
};
