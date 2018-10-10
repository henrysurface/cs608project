

//'/:username/project/:projectId/task/all'
const taskPage = function (req, res) {

    //let userId = req.session.userId;
    let username = req.params.username;
    let projectId = req.params.projectId;

    let query = "Select s.id, s.project_id, s.detail_id, "+
        "d.completed, d.deadline, d.description, d.fixed, "+
        "d.location, d.priority, d.start_at, d.title " +
        "from(SELECT t.id, t.project_id, t.detail_id FROM tasks t " +
        "join projects p on p.id = t.project_id where t.project_id = " +
        projectId + ") s join details d on d.id = s.detail_id;"
    // query database to get all the project with join operation
    //console.log(query);
    db.query(query, (err, ressult) => {
        let tasks = ressult;
        if (err) {
            message = err;
            console.log(err);
            tasks = [];
        }
        //console.log(tasks[0].start_at);

        res.render('task.ejs', {
            title: "Welcome to Project Note | View Tasks",
            tasks: tasks,
            username: username,
            projectId: projectId
        });
    });

};

module.exports.taskPage = taskPage;

//'/:username/project/:projectId/task/create'
const getCreatePage = function (req, res) {
    let message = '';
    let username = req.session.user.username;
    let projectId = req.params.projecId;
    res.render('create-task.ejs', {
        username: username,
        message: message,
        projectId: projectId
    });

};

module.exports.getCreatePage = getCreatePage;

//'/:username/project/:projectId/task/create'
const postCreatePage = function (req, res) {
    let userId = req.session.userId;
    let username = req.session.user.username;
    let detailId = "";
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let projectId = req.params.projectId;
    let project = req.body;
    let title = project.title;
    let startAt = project.start_at;
    let deadline = project.deadline;
    let priority = project.priority;
    let location = project.location;
    let description = project.description;
    let fixed = project.fixed;
    let completed = project.completed;

    //Handle OneToOne (project, detail)
    //1. insert detail for project
    //console.log(title, startAt, deadline);
    let insetProjectDetail = "INSERT INTO details(title, start_at, deadline" +
        ", priority, location, description, " +
        "fixed, completed" +
        ", create_at, update_at)" +
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    let qarr = [title, startAt, deadline, priority,
         location, description,
        fixed, completed, date, date
    ];

    db.query(insetProjectDetail, qarr, (err, result) => {
        if (err) {
            message = err;
            console.log(err);
        } else {
            detailId = result.insertId;
            let insetProjectQuery = "INSERT INTO tasks(project_id, detail_id, create_at, update_at)" +
                " VALUES ('" + projectId + "','" + detailId + "', '" + date + "', '" + date + "')";

            db.query(insetProjectQuery, (err, result) => {
                if (err) {
                    message = err;
                    console.log(err);
                } else {
                    //taskId = result.insertId;
                    let query = "Select s.id, s.project_id, s.detail_id, " +
                        "d.completed, d.deadline, d.description, d.fixed, " +
                        "d.location, d.priority, d.start_at, d.title " +
                        "from(SELECT t.id, t.project_id, t.detail_id FROM tasks t " +
                        "join projects p on p.id = t.project_id where t.project_id = " +
                        projectId + ") s join details d on d.id = s.detail_id;"
                    // query database to get all the project with join operation
                    //console.log(query);
                    db.query(query, (err, ressult) => {
                        let tasks = ressult;
                        if (err) {
                            message = err;
                            console.log(err);
                            tasks = [];
                        }
                        //console.log(tasks[0].start_at);

                        res.render('task.ejs', {
                            title: "Welcome to Project Note | View Tasks",
                            tasks: tasks,
                            username: username,
                            projectId: projectId
                        });
                    });
                }
            });
        }
    });




};

module.exports.postCreatePage = postCreatePage;

//'/:username/project/:projectId/task/:taskId/update/:detailId'
const getUpdatePage = function (req, res) {
    let message = '';
    //let project = req.body;
    let params = req.params;
    let taskId = params.taskId;
    let projectId = params.projecId;
    let username = params.username;

    let query = "select t.id, t.detail_id, d.completed, d.deadline, d.description, d.fixed," +
        "d.location, d.priority, d.start_at, d.title" +
        " from tasks t join details d on d.id = t.detail_id where t.id = " +
        taskId + "";
    db.query(query, (err, result) => {
        if (err) {
            message = err;
            console.log(err);
        }
        res.render('update-task.ejs', {
            title: "Welcome to Project Note | View Tasks",
            task: result[0],
            message: message,
            username: username,
            projectId: projectId
        });
        console.log(result);
    });

};

module.exports.getUpdatePage = getUpdatePage;

//'/:username/project/:projectId/task/:taskId/update/:detailId'
const postUpdatePage = function (req, res) {
    let message = '';
    let project = req.body;
    let params = req.params;
    let userId = req.session.userId;
    let detailId = params.detailId;
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let projectId = params.projectId;
    let taskId = params.taskId;
    let title = project.title;
    let startAt = project.start_at;
    let deadline = project.deadline;
    let priority = project.priority;
    let location = project.location;
    let description = project.description;
    let fixed = project.fixed;
    let completed = project.completed;
    let username = params.username;

   let query = "Update details d set d.title = ?," +
       "d.start_at = ?, d.deadline = ?" +
       ", d.priority = ?, d.location = ?, " +
       "d.description = ?, " +
       "d.fixed = ?, d.completed = ?" +
       ", d.update_at=? where d.id = " +
       "(select detail_id from tasks t where t.id =?)";

   let qarr = [title, startAt, deadline, priority, location,
       description, fixed, completed, date, taskId
   ]


    // execute query
    db.query(query, qarr, (err, result) => {
        console.log(query);
        message = "Succesfully! Your project has been updated.";
        if (err) {
            message = err;

        }
        //console.log(result);
        let showAllTasks = "Select s.id, s.project_id, s.detail_id, " +
            "d.completed, d.deadline, d.description, d.fixed, " +
            "d.location, d.priority, d.start_at, d.title " +
            "from(SELECT t.id, t.project_id, t.detail_id FROM tasks t " +
            "join projects p on p.id = t.project_id where t.project_id = " +
            projectId + ") s join details d on d.id = s.detail_id;"
        // query database to get all the project with join operation
        //console.log(query);
        db.query(showAllTasks, (err, ressult) => {
            let tasks = ressult;
            if (err) {
                message = err;
                console.log(err);
                tasks = [];
            }
            //console.log(tasks[0].start_at);

            res.render('task.ejs', {
                title: "Welcome to Project Note | View Tasks",
                tasks: tasks,
                username: username,
                projectId: projectId
            });
        });
    });
};

module.exports.postUpdatePage = postUpdatePage;

//'/:username/project/:projectId/task/:taskId/delete/:detailId'
const deletepage = function (req, res) {
    let params = req.params;
    //let project = req.body;
    //let detailId = params.detailId;
    let projectId = params.projectId;
    let taskId = params.taskId;
    //let userId = req.session.userId;
    let username = req.session.user.username;
    let message = "";

    let deleteProjectDetailQuery = "delete from details where details.id =" +
        " (select t.detail_id from tasks t where t.id ='" + taskId + "')";

    db.query(deleteProjectDetailQuery, (err, result1) => {
        if (err) {
            message = err;
            console.log(err);
        }else{
            let deleteTaskQuery = "delete from tasks where tasks.id = '" + taskId + "'";
            db.query(deleteTaskQuery, (err, result2) => {
                if (err) {
                    message = err;
                    console.log(err);
                }else{
                    //console.log(result);
                    let query = "Select s.id, s.project_id, s.detail_id, " +
                        "d.completed, d.deadline, d.description, d.fixed, " +
                        "d.location, d.priority, d.start_at, d.title " +
                        "from(SELECT t.id, t.project_id, t.detail_id FROM tasks t " +
                        "join projects p on p.id = t.project_id where t.project_id = " +
                        projectId + ") s join details d on d.id = s.detail_id;"
                    // query database to get all the project with join operation
                    //console.log(query);
                    db.query(query, (err, ressult3) => {
                        let tasks = ressult3;
                        if (err) {
                            message = err;
                            console.log(err);
                            tasks = [];
                        }else{
                            res.render('task.ejs', {
                                title: "Welcome to Project Note | View Tasks",
                                tasks: tasks,
                                message:message,
                                username: username,
                                projectId: projectId
                            });
                        }
                    });
                }
            });
        }
    });
};

module.exports.deletepage = deletepage;