# CS 608 project (Personal note)

This is a guild for using this source code

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing and Running this source code

Please follow below steps to install this web application and sql script in MySQL database system.

```
git clone https://github.com/henrysurface/cs608project
```
open and execute sql script in fake_script folder: project.sql

return to project directory
```
npm start
```

Please open app.js and modify db as following:

```
const db = mysql.createConnection({
      host: 'localhost',
      user: 'root', // user of your database
      password: '', // password of your database
      database: 'timelapser_app3',
      port: 3306
    });
```

### Loging

The test account ans password:

```
username: test1
password: 1111
```


End with an example of getting some data out of the system or using it for a little demo


## Author

* **Billie Thompson** - *Initial work* - [henrysurface](https://github.com/henrysurface/cs608project)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
