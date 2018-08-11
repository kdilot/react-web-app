module.exports = function (app) {
  const express = require('express');
  const route = express.Router();
  const bodyParser = require('body-parser');
  const db = require('config/db')();
  app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
  app.use(bodyParser.json());

  route.get('/list', function (req, res) {
    let sql = "SELECT id as 'key', date, type, category, description, sum FROM income_list";
    db.query(sql, function (err, rows, fields) {
      res.json(rows)
      // console.log(rows)
    })
  })

  route.post('/sum', function (req, res) {
    let sql = `SELECT sum(sum) as ${req.body.type} FROM income_list WHERE type='${req.body.type}'`;
    db.query(sql, function (err, rows, fields) {
      res.json(rows[0])
      // console.log(rows)
    })
  })

  route.post('/item', function (req, res) {
    let sql = 'INSERT INTO income_list SET ?'
    const data = {
      date: req.body.date,
      type: req.body.type,
      category: req.body.category,
      description: req.body.description,
      sum: req.body.sum
    }
    // const data = JSON.parse(req)

    db.query(sql, data, function (err, result) {
      if (err) res.json(err)
      res.json(result)
    })
  })

  return route;
};
