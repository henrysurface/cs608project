//var express = require('express');
//var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });


const login = function (req, res) {
  var message = '';
  var sess = req.session;

  if (req.method == "POST") {
    var post = req.body;
    var name = post.username;
    var pass = post.password;
    console.log(name);
    var sql = "SELECT * FROM `users` WHERE `username`='" + name + "' and password = '" + pass + "'";
    db.query(sql, function (err, results) {
      console.log(results);
      if (Object.keys(results).length !== 0) {
        req.session.userId = results[0].id;
        req.session.user = results;
        //console.log(results[0].id);
        let username = results[0].username;
        res.redirect('/' + username + '/project/all');
      }
      else{
          message = 'Wrong password or User Name.';
          res.render('index.ejs', {
          message: message,
          username: ''
        });
      }

    });
  } else {
    res.render('index.ejs', {
      message: message
    });
  }
};

module.exports.login = login;

const signup = function (req, res) {
  message = '';
  if (req.method == "POST") {
    let post = req.body;
    let firstname = post.first_name;
    let lastname = post.last_name;
    let middlename = post.middle_name;
    let username = post.username;
    let password = post.password;
    let email = post.email;
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    //console.log(date, firstname);
    let sql = "INSERT INTO `users` (first_name, middle_name, last_name," +
      "username, password, email, create_at, update_at)" +
      " VALUES ('"+firstname+"','"+middlename + "'," +
      "'" + lastname + "','" + username + "','" + password + "'" +
      ",'" + email + "','" + date + "','" + date + "')";
    db.query(sql, function (err, result) {
      if(err){
        message = "Please choice another username!";
        console.log(err);
      }
      message = "Succesfully! Your account has been created.";
      res.render('index.ejs', {
        message: message,
        username: '',
        projectId: ''
      });
    });

  } else {
    res.render('signup',{
      message: '',
      username: '',
      projectId: ''
    });
  }
};
module.exports.signup = signup;


const getUserData = function (req, res) {

  let user = req.session.user;
  let userId = req.session.userId;
  let username = req.body.username;

  if (userId == null) {
    res.redirect("/login");
    return;
  }

  var sql = "SELECT * FROM `users` WHERE `id`='" + userId + "'";

  db.query(sql, function (err, results) {

    console.log(results);
    let userData = results;
    res.render('profile.ejs', {
      user: userData[0],
      message:'',
      projectId:'',
      username:username
    });

  });
};

module.exports.getUserData = getUserData;


const postUserData = function (req, res) {

  //let user = req.session.user;
  let userId = req.session.userId;
  let userData = req.body;
  let firstname = userData.first_name;
  let middlename = userData.middle_name;
  let lastname = userData.last_name;
  let username = userData.username;
  let email = userData.email;
  let password = userData.password;

  if (userId == null) {
    res.redirect("/");
    return;
  }

  let sql = "Update users u set u.first_name = ?, u.middle_name = ?, u.last_name = ?, "+
            "u.username = ?, u.email = ? , u.password= ? WHERE `id`= ?";
  let qaray = [firstname, middlename, lastname, username, email, password, userId]

  db.query(sql, qaray ,function (err, results) {
    let message ='User info update successfully. please login again.'
    
    if(err){
      message = err;
      console.log(err);
    }
    req.session.destroy();
    res.render('index.ejs', {
      message: message,
      projectId: '',
      username: ''
    });

  });
};

module.exports.postUserData = postUserData;

const logout = function (req, res){
  req.session.destroy();
  res.redirect('/');
}
module.exports.logout = logout;