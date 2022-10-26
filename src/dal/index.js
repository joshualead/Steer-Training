var mysql = require("mysql2");
var QUERIES = require("../constants/index.js");
require("dotenv").config();

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const connectionPromise = new Promise((res, rej) => {
  res();
  rej();
});

const dal = {
  selectCred: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_CRED, uid, callback);
      })
      .catch((err) => {
        callback(err);
      });
  },
  adminDashboard: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_STATUS_FROM_COURSE, callback);
      })
      .catch((err) => callback(err));
  },
  addAdmin: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_ADMIN_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  deleteAdmin: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_ADMIN, uid, callback);
      })
      .catch((err) => callback(err));
  },
  showAdmins: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_ADMIN_TABLE, callback);
      })
      .catch((err) => callback(err));
  },
  adminCourses: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_COURSE_TABLE, callback);
      })
      .catch((err) => callback(err));
  },
  addCourse: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_COURSE_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  deleteCourse: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_COURSE, cid, callback);
      })
      .catch((err) => callback(err));
  },
  updateTrainerCourse: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.UPDATE_TRAINER_ASSIGNED_COURSE, uid, callback);
      })
      .catch((err) => callback(err));
  },
  checkTcmapCourse: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.CHECK_IF_COURSE_IN_TCMAP, callback);
      })
      .catch((err) => callback(err));
  },
  getTrainerWithCid: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.GET_TRAINER_WCID, cid, callback);
      })
      .catch((err) => callback(err));
  },
  adminTrainers: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_TRAINER_TABLE, callback);
      })
      .catch((err) => callback(err));
  },
  checkIfIDExists: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.CHECK_CRED_ID, uid, callback);
      })
      .catch((err) => callback(err));
  },
  addCred: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_CRED_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  deleteCred: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_CRED_TABLE, uid, callback);
      })
      .catch((err) => callback(err));
  },
  addTrainer: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_TRAINER_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  deleteTrainer: (trid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_TRAINER, trid, callback);
      })
      .catch((err) => callback(err));
  },
  getCourseStatus: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.GET_COURSE_STATUS, cid, callback);
      })
      .catch((err) => callback(err));
  },
  updateCourseAssigned: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.UPDATE_ASSIGNED_COURSE, list, callback);
      })
      .catch((err) => callback(err));
  },
  updateAssignStatus: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.UPDATE_ASSIGN_STATUS, list, callback);
      })
      .catch((err) => callback(err));
  },
  adminTrainees: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_TRAINEE_TABLE, callback);
      })
      .catch((err) => callback(err));
  },
  addTrainee: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_TRAINEE_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  tcmapInsert: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_TCMAP_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  deleteTrainee: (teid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_TRAINEE, teid, callback);
      })
      .catch((err) => callback(err));
  },
  adminScores: (callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_COMPLETED_COURSES, callback);
      })
      .catch((err) => callback(err));
  },
  adminScoresSpecific: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_AVG_SCORES, cid, callback);
      })
      .catch((err) => callback(err));
  },
  trainerDashboard: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_COURSE_TAKEN, uid, callback);
      })
      .catch((err) => callback(err));
  },
  selectCourse: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_COURSE_TABLE_SPEC, cid, callback);
      })
      .catch((err) => callback(err));
  },
  trainerTasks: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_JOIN_SCORE_NAME, list, callback);
      })
      .catch((err) => callback(err));
  },
  trainerViewSubmission: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_SUBMISSION_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  trainerViewSubmissionScore: (sid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_SINGLE_SCORE, sid, callback);
      })
      .catch((err) => callback(err));
  },
  addTask: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_TASK_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  selectTcmap: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_TCMAP_TABLE, cid, callback);
      })
      .catch((err) => callback(err));
  },
  selectTask: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_TASK_ID, list, callback);
      })
      .catch((err) => callback(err));
  },
  selectTaskSpec: (cid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_TASK_TABLE, cid, callback);
      })
      .catch((err) => callback(err));
  },
  insertScoreTable: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_SCORE_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  deleteTask: (tid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_TASK, tid, callback);
      })
      .catch((err) => callback(err));
  },
  editScore: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.UPDATE_SCORE, list, callback);
      })
      .catch((err) => callback(err));
  },
  trainerCompleteCourse: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.UPDATE_ASSIGN_STATUS_DATE, list, callback);
      })
      .catch((err) => callback(err));
  },
  traineeDashboard: (uid, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_JOIN_TRAINEE_COURSES, uid, callback);
      })
      .catch((err) => callback(err));
  },
  traineeDoTask: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_SUBMISSION_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  traineeTaskSubmit: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_SUBMISSION_TABLE, list, callback);
      })
      .catch((err) => callback(err));
  },
  profile: (type, uid, callback) => {
    connectionPromise
      .then(() => {
        var query = "";
        if (type === "trainer") {
          query = QUERIES.SELECT_TRAINER_TABLE_SPEC;
        } else if (type === "trainee") {
          query = QUERIES.SELECT_TRAINEE_TABLE_SPEC;
        } else if (type === "admin") {
          query = QUERIES.SELECT_ADMIN_TABLE_SPEC;
        }
        con.query(query, uid, callback);
      })
      .catch((err) => callback(err));
  },
  passwordChange: (list, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.UPDATE_PASSWORD, list, callback);
      })
      .catch((err) => callback(err));
  },
  refreshTokenInsert: (rt, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.INSERT_TOKEN, rt, callback);
      })
      .catch((err) => callback(err));
  },
  refreshTokenSelect: (rt, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.SELECT_TOKEN, rt, callback);
      })
      .catch((err) => callback(err));
  },
  refreshTokenDelete: (rt, callback) => {
    connectionPromise
      .then(() => {
        con.query(QUERIES.DELETE_TOKEN, rt, callback);
      })
      .catch((err) => callback(err));
  },
};

module.exports = dal;
