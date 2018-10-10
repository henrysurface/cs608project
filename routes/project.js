

const projectPage = function (req, res) {
        
        let userId = req.session.userId;
        let username = req.params.username;
        let projectId = '';
        let message = '';

        let query = "Select s.id, s.create_at, s.update_at ,s.detail_id, "+
                    "d.completed, d.deadline, d.description, d.fixed," +
                    "d.location, d.priority, d.start_at, d.title " +
                    "from(SELECT * FROM projects p join user_projects "+
                    " b on p.id = b.project_id where b.user_id = "+
                    userId + ") s join details d on d.id = s.detail_id";
        // query database to get all the project with join operation
        //console.log(query);
        db.query(query, (err, ressult) => {
            let projects = ressult;
            if (err) {
                message = err;
                console.log(err);
                projects = [];
            }
            //console.log(projects[0].start_at);
            
            res.render('project.ejs', {
                title: "Welcome to Project Note | View Projects",
                projects: projects,
                username: username,
                projectId: projectId,
                message: message
            });
        });

};

module.exports.projectPage = projectPage;

const getCreatePage = function (req, res) {
    let message = '';
    let username = req.session.user.username;
    let projectId = '';
    res.render('create-project.ejs', {
        username: username,
        message: message,
        projectId: projectId
    });

};

module.exports.getCreatePage = getCreatePage;

const postCreatePage = function (req, res) {
    let userId = req.session.userId;
    let username = req.params.username;
    let detailId = "";
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let projectId = "";
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

    let qarr = [title, startAt, deadline , priority, location, description,
         fixed , completed , date ,  date ];

    db.query(insetProjectDetail, qarr, (err, result) => {
        if (err) {
            message = err;
            console.log(err);
        } else {
            detailId = result.insertId;
            let insetProjectQuery = "INSERT INTO projects(detail_id, create_at, update_at)" +
                " VALUES ('" + detailId + "', '" + date + "', '" + date + "')";

            db.query(insetProjectQuery, (err, result) => {
                if (err) {
                    message = err;
                    console.log(err);
                } else {
                    projectId = result.insertId;
                    let saveUserProjectRelationship = "insert into user_projects(user_id, project_id) " +
                        " values( '" + userId + "', '" + projectId + "')";
                    db.query(saveUserProjectRelationship, (err, result) => {
                        message = "Succesfully! Your project has been created."
                        if (err) {
                            message = err;
                            console.log(err);
                        }
                        let allProject = "Select s.id, s.create_at, s.update_at ,s.detail_id, " +
                            "d.completed, d.deadline, d.description, d.fixed," +
                            "d.location, d.priority, d.start_at, d.title " +
                            "from(SELECT * FROM projects p join user_projects b on p.id = b.project_id where b.user_id = " +
                            userId + ") s join details d on d.id = s.detail_id";
                        // query database to get all the project with join operation
                        console.log(allProject);
                        db.query(allProject, (err, ressult) => {
                            let projects = ressult;
                            if (err) {
                                message = err;
                                console.log(err);
                                projects = [];
                            }
                            res.render('project.ejs', {
                                title: "Welcome to Project Note | View Projects",
                                projects: projects,
                                username: username,
                                projectId: ''
                            });
                        });
                    });
                }
            });
        }
    });


    

};

module.exports.postCreatePage = postCreatePage;


const getUpdatePage = function (req, res) {
    let message = '';
    //let project = req.body;
    let username = req.params.username;
    let params = req.params;
    let projectId = params.projectId;

    let query = "select p.id, p.detail_id, d.completed, d.deadline, d.description, d.fixed,"+
                "d.location, d.priority, d.start_at, d.title"+
                " from projects p join details d on d.id = p.detail_id where p.id = " +
                 projectId + "";
    db.query(query, (err, result) =>{
        if(err) {
            message = err;
            console.log(err);
        }
        res.render('update-project.ejs', {
            title: "Welcome to Project Note | View Projects",
            project: result[0],
            message: message,
            projectId: '',
            username: username
        });
        console.log(result);
    });
    
};

module.exports.getUpdatePage = getUpdatePage;

const postUpdatePage = function (req, res) {
    let message = '';
    let project = req.body;
    let params = req.params;
    let userId = req.session.userId;
    let detailId = params.detailId;
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let projectId = params.projectId;
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
        "(select detail_id from projects p where p.id =?)";
    
    let qarr = [title, startAt, deadline, priority, location, 
        description, fixed, completed, date, projectId]

    // execute query
    db.query(query, qarr, (err, result) => {
        console.log(query);
        message = "Succesfully! Your project has been updated.";
        if (err) {
            message = err;
            console.log(err);
        }
        let allProject = "Select s.id, s.create_at, s.update_at ,s.detail_id, " +
            "d.completed, d.deadline, d.description, d.fixed," +
            "d.location, d.priority, d.start_at, d.title " +
            "from(SELECT * FROM projects p join user_projects b on p.id = b.project_id where b.user_id = " +
            userId + ") s join details d on d.id = s.detail_id";

        db.query(allProject, (err, result) => {
            if (err) {
                message = err;
            }
            res.render('project.ejs', {
                title: "Welcome to Project Note | View Projects",
                projects: result,
                message: message,
                username: username,
                projectId: ''
            });
        });
        
    });

    
};

module.exports.postUpdatePage = postUpdatePage;


const deletepage = function (req, res) {
    let params = req.params;
    let project = req.body;
    let detailId = params.detailId;
    let projectId = params.projectId;
    let userId = req.session.userId;
    let username = req.params.username;
    let message = "";

    let deleteProjectDetailQuery = "delete from details where details.id =" +
        " (select p.detail_id from projects p where p.id ='"+ projectId +"')";
    
    db.query(deleteProjectDetailQuery, (err, res)=>{
        if(err){
            message = err;
            console.log(err);
        }
    });
    // execute query
    let deleteProjectQuery = "delete from projects where projects.id = '" + projectId + "'";
    db.query(deleteProjectQuery, (err, result) => {
        if (err) {
            message = err;
            console.log(err);
        }
    });

    let allProject = "Select s.id, s.create_at, s.update_at ,s.detail_id, " +
        "d.completed, d.deadline, d.description, d.fixed," +
        "d.location, d.priority, d.start_at, d.title " +
        "from(SELECT * FROM projects p join user_projects b on p.id = b.project_id where b.user_id = " +
        userId + ") s join details d on d.id = s.detail_id";
    // query database to get all the project with join operation
    db.query(allProject, (err, ressult) => {
        let projects = ressult;
        if (err) {
            message = err;
            console.log(err);
            projects = [];
        }
        res.render('project.ejs', {
            title: "Welcome to Project Note | View Projects",
            message: message,
            projects: projects,
            username: username,
            projectId:''
        });
    });
};

module.exports.deletepage = deletepage;