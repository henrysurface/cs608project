var express = require('express');
//var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

const index = function (req, res) {
    let message = '';
    let username = '';
    let projectId = '';
    res.render('index', {
      message: message,
      username: username,
      projectId: projectId
    });
  }
module.exports.index = index;

