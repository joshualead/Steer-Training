const QUERIES = {
  INSERT_ADMIN_TABLE:
    "INSERT INTO admin_table (user_id, name) VALUES (?,?)",
  INSERT_TRAINER_TABLE:
    "INSERT INTO trainer_table (user_id, name, course_id) VALUES (?,?,?);",
  INSERT_TRAINEE_TABLE:
    "INSERT INTO trainee_table (user_id, name, courses) VALUES (?,?,?);",
  INSERT_COURSE_TABLE:
    "INSERT INTO course_table (course_name, description, assigned_status) VALUES (?,?,?);",
  INSERT_TCMAP_TABLE:
    "INSERT INTO tcmap_table (user_id, course_id) VALUES (?,?);",
  INSERT_TASK_TABLE:
    "INSERT INTO task_table (task_name, description, course_id, status) VALUES (?,?,?,?);",
  INSERT_SCORE_TABLE:
    "INSERT INTO score_table (trainee_id, course_id, task_id, score) VALUES (?,?,?,?);",
  INSERT_SUBMISSION_TABLE:
    "INSERT INTO submission_table (trainee_id, task_id, course_id, content, date) VALUES (?,?,?,?,?);",
  INSERT_REFRESH_TOKEN:
    "INSERT INTO refreshToken_table (refreshToken) VALUES (?);",
  UPDATE_ASSIGN_STATUS_DATE:
    "UPDATE course_table SET assigned_status = ?, date = ?  WHERE course_id = ?;",
  UPDATE_ASSIGN_STATUS:
    "UPDATE course_table SET assigned_status = ?  WHERE course_id = ?;",
  UPDATE_ASSIGNED_COURSE:"UPDATE trainer_table SET course_id = ?  WHERE user_id = ?;",
  UPDATE_SCORE: "UPDATE score_table SET score=? WHERE score_id = ?",
  UPDATE_PASSWORD:
    "UPDATE credentials_table SET password = ? WHERE user_id = ?",
  SELECT_REFRESH_TABLE:
    "SELECT refreshToken FROM refreshToken_table WHERE refreshToken=?",
  SELECT_ADMIN_TABLE: "SELECT * FROM admin_table",
  SELECT_TRAINER_TABLE: "SELECT * FROM trainer_table",
  SELECT_TRAINEE_TABLE: "SELECT * FROM trainee_table",
  SELECT_COURSE_TABLE: "SELECT * FROM course_table",
  GET_COURSE_STATUS:"SELECT assigned_status FROM course_table WHERE course_id = ?",
  SELECT_TRAINER_TABLE_SPEC:
    "SELECT trainer_table1.user_id AS user_id, trainer_table1.name AS name, credentials_table.email AS email FROM (SELECT * FROM trainer_table WHERE user_id = ?) AS trainer_table1 INNER JOIN credentials_table ON trainer_table1.user_id = credentials_table.user_id ",
  SELECT_TRAINEE_TABLE_SPEC:
    "SELECT trainee_table1.user_id AS user_id, trainee_table1.name AS name, credentials_table.email AS email FROM (SELECT * FROM trainee_table WHERE user_id = ?) AS trainee_table1 INNER JOIN credentials_table ON trainee_table1.user_id = credentials_table.user_id ",
  SELECT_ADMIN_TABLE_SPEC:
    "SELECT admin_table1.user_id AS user_id, admin_table1.name AS name, credentials_table.email AS email FROM (SELECT * FROM admin_table WHERE user_id = ?) AS admin_table1 INNER JOIN credentials_table ON admin_table1.user_id = credentials_table.user_id ",
  SELECT_TASK_TABLE: "SELECT * FROM task_table WHERE course_id=?",
  SELECT_COURSE_TABLE_SPEC: "SELECT * FROM course_table WHERE course_id = ?",
  SELECT_TASK_ID:
    "SELECT task_id from task_table WHERE task_name=? AND description=? AND course_id=?",
  SELECT_SUBMISSION_TABLE:
    "SELECT * FROM submission_table WHERE trainee_id= ? AND course_id= ? AND task_id=?",
  SELECT_SCORE_TABLE:
    "SELECT * FROM score_table WHERE task_id=? AND course_id=?",
  SELECT_SINGLE_SCORE: "SELECT * FROM score_table WHERE score_id=?",
  SELECT_JOIN_SCORE_NAME: `SELECT score_table1.score_id AS score_id, score_table1.trainee_id AS trainee_id, trainee_table.name AS trainee_name, score_table1.score AS score  FROM 
    (SELECT * FROM score_table WHERE task_id=? AND course_id=?) AS score_table1 INNER JOIN 
    trainee_table ON score_table1.trainee_id=trainee_table.user_id;`,
  SELECT_JOIN_TRAINEE_COURSES: `SELECT * FROM (SELECT course_id FROM tcmap_table WHERE user_id=?) AS trainee_course_view INNER JOIN 
  course_table ON trainee_course_view.course_id=course_table.course_id;`,
  SELECT_TCMAP_TABLE: "SELECT user_id FROM tcmap_table WHERE course_id=?",
  SELECT_STATUS_FROM_COURSE:
    "SELECT assigned_status,count(*) as status_details_count FROM course_table GROUP BY assigned_status",
  SELECT_COMPLETED_COURSES:
    "SELECT * FROM course_table WHERE assigned_status = 2 OR assigned_status = 3 ORDER BY date DESC",
  SELECT_UNASSIGNED_COURSES:
    "SELECT * FROM course_table WHERE assigned_status = 0",
  SELECT_AVG_SCORES:
    "SELECT trainee_id,AVG(score) AS avgmarks FROM score_table WHERE course_id=? GROUP BY trainee_id",
  GET_TRAINER_WCID : "SELECT * FROM trainer_table WHERE course_id=?",

  SELECT_COURSE_TAKEN: "SELECT course_id from trainer_table WHERE user_id = ?",
  DELETE_COURSE: "DELETE FROM course_table WHERE course_id=?",
  DELETE_ADMIN: "DELETE FROM admin_table WHERE user_id=?",
  DELETE_TRAINER: "DELETE FROM trainer_table WHERE user_id=?",
  DELETE_TASK_WCID : "DELETE FROM task_table WHERE course_id=?",
  DELETE_SUBMISSION_WCID : "DELETE FROM submission_table WHERE course_id=?",
  DELETE_SCORE_WCID : "DELETE FROM score_table WHERE course_id=?",
  DELETE_TRAINEE: "DELETE FROM trainee_table WHERE user_id=?",
  DELETE_TASK: "DELETE FROM task_table WHERE task_id=?",
  DELETE_SCORE: "DELETE FROM score_table WHERE task_id=?",
  DELETE_REFRESH_TOKEN: "DELETE FROM refreshToken_table WHERE refreshToken=?",
  DELETE_TOKEN: "DELETE FROM token_table WHERE token=?",
  CHECK_CRED_ID:
    "SELECT EXISTS(SELECT * from credentials_table WHERE user_id=?) AS v;",
  INSERT_TOKEN: "INSERT INTO token_table (token) VALUES (?)",
  SELECT_CRED: "SELECT * FROM credentials_table WHERE user_id=?",
  INSERT_CRED_TABLE:
    "INSERT INTO credentials_table (user_id,password,email,type) VALUES (?,'$2b$10$r.HQlbkidfFMRNCEnpco1e4DGVXzhCPDO4iEHFk5KPMZLeN4IuQ6C',?,?)",
  DELETE_CRED_TABLE: "DELETE FROM credentials_table WHERE user_id=?",
  SELECT_TOKEN: "SELECT * FROM token_table WHERE token=?",
  CHECK_IF_MAIL:"SELECT * from credentials_table WHERE email=?"
};
module.exports = QUERIES;
