const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dal = require("./../dal/index");
require("dotenv").config();

const Controller = {
  entry: async (req, res) => {
    res.render("login.ejs", { flag: 0 });
  },
  login: async (req, res) => {
    dal.selectCred(req.body.userID, async (err, arr) => {
      if (err || arr.length === 0) {
        res.render("login.ejs", { flag: 1 });
      } else if (await bcrypt.compare(req.body.password, arr[0].password)) {
        var user = { userid: req.body.userID };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "30m",
        });
        dal.refreshTokenInsert(accessToken, (err) => {
          if (err) console.log(err);
          if (arr[0].type === 0) {
            res.redirect(`./admin/dashboard/${accessToken}`);
          } else if (arr[0].type === 1) {
            res.redirect(`./trainer/dashboard/${accessToken}`);
          } else if (arr[0].type === 2) {
            res.redirect(`./trainee/dashboard/${accessToken}`);
          } else {
            res.render("login.ejs", { flag: 1 });
          }
        });
      } else {
        res.render("login.ejs", { flag: 1 });
      }
    });
  },
  adminDashboard: (req, res) => {
    dal.showAdmins((err, arr2) => {
      if (err) console.log(err);
      dal.adminDashboard((err, arr1) => {
        if (err) console.log(err);
        var arrCount = arr1.map(function (obj) {
          return parseInt(obj.status_details_count);
        });
        res.render("./admin/dashboard", {
          adminsArr: arr2,
          userid: req.user.userid,
          statusDetailsArr: arr1,
          token: req.params.token,
          arrCount,
        });
      });
    });
  },
  addAdmin: (req, res) => {
    dal.checkIfIDExists(req.body.adminid, (err, val) => {
      if (val[0].v === 0) {
        dal.addCred([req.body.adminid, req.body.email, 0], (err) => {
          if (err) console.log(err);
          dal.addAdmin([req.body.adminid, req.body.adminname], (err) => {
            if (err) console.log(err);
            res.redirect(`/admin/dashboard/${req.body.token}`);
          });
        });
      } else {
        res.redirect(`/admin/dashboard/${req.body.token}`);
      }
    });
  },
  deleteAdmin: (req, res) => {
    dal.deleteCred(req.body.adminid, (err) => {
      if (err) console.log(err);
      dal.deleteAdmin(req.body.adminid, (err) => {
        if (err) console.log(err);
        res.redirect(`/admin/dashboard/${req.body.token}`);
      });
    });
  },
  adminCourses: (req, res) => {
    dal.adminCourses((err, arr) => {
      if (err) console.log(err);
      res.render("./admin/coursesPage", {
        userid: req.user.userid,
        courseArr: arr,
        token: req.params.token,
      });
    });
  },
  addCourse: (req, res) => {
    dal.addCourse([req.body.courseName, req.body.courseDesc, 0], (err) => {
      if (err) console.log(err);
      res.redirect(`/admin/courses/${req.body.token}`);
    });
  },
  deleteCourse: (req, res) => {
    dal.deleteCourse(req.body.courseid, (err) => {
      if (err) console.log(err);
      dal.getTrainerWithCid(req.body.courseid, (err, arr) => {
        if (err) console.log(err);
        // ---CODE TO DELETE THE OTHER DANGLINGS---
        // dal.deleteTaskWithCid(req.body.courseid, (err) => {
        //   if (err) console.log(err);
        //   dal.deleteSubmissionWithCid(req.body.courseid, (err) => {
        //     if (err) console.log(err);
        //     dal.deleteScoreWithCid(req.body.courseid, (err) => {
        //       if (err) console.log(err);
        //       res.redirect(`/admin/courses/${req.body.token}`);
        //     });          
        //   });
        // });
        if (arr.length === 0) {
          res.redirect(`/admin/courses/${req.body.token}`);
        } else {
          dal.deleteCred(arr[0].user_id, (err) => {
            if (err) console.log(err);
            dal.deleteTrainer(arr[0].user_id, (err) => {
              if (err) console.log(err);
              res.redirect(`/admin/courses/${req.body.token}`);
            });
          });
        }
      });
    });
  },
  adminTrainers: (req, res) => {
    dal.adminCourses((err, arr1) => {
      if (err) console.log(err);
      dal.adminTrainers((err, arr) => {
        if (err) console.log(err);
        res.render("./admin/trainersPage", {
          userid: req.user.userid,
          trainerArr: arr,
          token: req.params.token,
          courses: arr1,
          flag: req.params.flag,
        });
      });
    });
  },
  addTrainer: async (req, res) => {
    dal.checkIfIDExists(req.body.trainerid, (err, val) => {
      if (val[0].v === 0) {
        dal.addCred([req.body.trainerid, req.body.email, 1], (err) => {
          if (err) console.log(err);
          dal.addTrainer(
            [req.body.trainerid, req.body.name, req.body.courseid],
            (err) => {
              if (err) console.log(err);
              dal.updateAssignStatus([1, req.body.courseid], (err) => {
                if (err) console.log(err);
                res.redirect(`/admin/trainers/${req.body.token}/0`);
              });
            }
          );
        });
      } else {
        res.redirect(`/admin/trainers/${req.body.token}/1`);
      }
    });
  },
  deleteTrainer: (req, res) => {
    dal.deleteCred(req.body.trainerid, (err) => {
      if (err) console.log(err);
      dal.deleteTrainer(req.body.trainerid, (err) => {
        if (err) console.log(err);
        dal.getCourseStatus(req.body.courseid, (err, val) => {
          if (err) console.log(err);
          dal.updateAssignStatus(
            [val[0].assigned_status === 2 ? 3 : 0, req.body.courseid],
            (err) => {
              if (err) console.log(err);
              res.redirect(`/admin/trainers/${req.body.token}/0`);
            }
          );
        });
      });
    });
  },
  reassignTrainer: (req, res) => {
    dal.getCourseStatus(req.body.courseid, (err, val) => {
      if (err) console.log(err);
      console.log(val);
      dal.updateAssignStatus(
        [val[0].assigned_status === 2 ? 3 : 0, req.body.courseid],
        (err) => {
          if (err) console.log(err);
          dal.updateCourseAssigned(
            [req.body.newcourseid, req.body.trainerid],
            (err) => {
              if (err) console.log(err);
              dal.updateAssignStatus([1, req.body.newcourseid], (err) => {
                if (err) console.log(err);
                res.redirect(`/admin/trainers/${req.body.token}/0`);
              });
            }
          );
        }
      );
    });
  },
  adminTrainees: (req, res) => {
    dal.adminCourses((err, arr1) => {
      if (err) console.log(err);
      dal.adminTrainees((err, arr) => {
        if (err) console.log(err);
        res.render("./admin/traineesPage", {
          userid: req.user.userid,
          traineeArr: arr,
          token: req.params.token,
          courseArr: arr1,
          flag: req.params.flag,
        });
      });
    });
  },
  addTrainee: async (req, res) => {
    dal.checkIfIDExists(req.body.traineeid, (err, val) => {
      if (typeof req.body.courses === "string") {
        var temo = req.body.courses;
      } else {
        var temo = req.body.courses.join(", ");
      }
      if (val[0].v === 0) {
        dal.addCred([req.body.traineeid, req.body.email, 2], (err) => {
          if (err) console.log(err);
          dal.addTrainee([req.body.traineeid, req.body.name, temo], (err) => {
            if (err) console.log(err);
            if (typeof req.body.courses === "string") {
              dal.tcmapInsert(
                [req.body.traineeid, parseInt(req.body.courses.split("-")[0])],
                (err) => {
                  if (err) console.log(err);
                }
              );
            } else {
              for (var m = 0; m < req.body.courses.length; m++) {
                var tarr = req.body.courses[m].split("-");
                dal.tcmapInsert(
                  [req.body.traineeid, parseInt(tarr[0])],
                  (err) => {
                    if (err) console.log(err);
                  }
                );
              }
            }
            res.redirect(`/admin/trainees/${req.body.token}/0`);
          });
        });
      } else {
        res.redirect(`/admin/trainees/${req.body.token}/1`);
      }
    });
  },
  deleteTrainee: (req, res) => {
    dal.deleteCred(req.body.traineeid, (err) => {
      if (err) console.log(err);
      dal.deleteTrainee(req.body.traineeid, (err) => {
        if (err) console.log(err);
        res.redirect(`/admin/trainees/${req.body.token}/0`);
      });
    });
  },
  adminScores: (req, res) => {
    dal.adminScores((err, arr) => {
      if (err) console.log(err);
      var wholeAvg = 0;
      res.render("./admin/scores", {
        userid: req.user.userid,
        completed_courses: arr,
        scoreData: [],
        arrID: [],
        arrMark: [],
        token: req.params.token,
        wholeAvg
      });
    });
  },
  adminScoresSpecific: (req, res) => {
    dal.adminScoresSpecific(parseInt(req.params.courseid), (err, arr1) => {
      if (err) console.log(err);
      dal.adminScores((err, arr) => {
        if (err) console.log(err);
        var arrID = arr1.map(function (obj) {
          return obj.trainee_id;
        });
        var arrMark = arr1.map(function (obj) {
          return parseInt(obj.avgmarks);
        });
        var wholeAvg = arrMark.reduce((a, b) => a + b, 0) / arrMark.length;
        res.render("./admin/scores", {
          userid: req.user.userid,
          completed_courses: arr,
          scoreData: arr1,
          arrID,
          arrMark,
          token: req.params.token,
          wholeAvg
        });
      });
    });
  },
  trainerDashboard: (req, res) => {
    dal.trainerDashboard(req.user.userid, (err, arr) => {
      if (err) console.log(err);
      dal.selectTaskSpec(arr[0].course_id, (err, arr2) => {
        if (err) console.log(err);
        dal.selectCourse(arr[0].course_id, (err, arr3) => {
          if (err) console.log(err);
          res.render("./trainer/dashboard", {
            userid: req.user.userid,
            taskArr: arr2,
            courseDetails: arr3[0],
            token: req.params.token,
          });
        });
      });
    });
  },
  trainerTasks: (req, res) => {
    dal.trainerTasks([req.params.taskid, req.params.courseid], (err, arr) => {
      if (err) console.log(err);
      res.render("./trainer/taskPage", {
        userid: req.user.userid,
        taskname: req.params.taskname,
        scoreArr: arr,
        courseid: req.params.courseid,
        taskid: req.params.taskid,
        token: req.params.token,
      });
    });
  },
  trainerViewSubmission: (req, res) => {
    dal.trainerViewSubmissionScore(req.params.scoreid, (err, arr1) => {
      if (err) console.log(err);
      dal.trainerViewSubmission(
        [arr1[0].trainee_id, arr1[0].course_id, arr1[0].task_id],
        (err, arr) => {
          res.render("./trainer/submissionPage", {
            userid: req.user.userid,
            taskname: req.params.taskname,
            traineename: req.params.traineename,
            traineeid: arr1[0].trainee_id,
            courseid: arr1[0].course_id,
            taskid: arr1[0].task_id,
            sub: arr,
            scoreid: req.params.scoreid,
            token: req.params.token,
            score: arr1[0].score,
          });
        }
      );
    });
  },
  addTask: (req, res) => {
    dal.addTask(
      [req.body.taskName, req.body.taskDesc, req.body.courseid, 0],
      (err) => {
        if (err) console.log(err);
        dal.selectTcmap(req.body.courseid, (err, arr) => {
          if (err) console.log(err);
          dal.selectTask(
            [req.body.taskName, req.body.taskDesc, req.body.courseid],
            (err, arr1) => {
              if (err) console.log(err);
              for (var m = 0; m < arr.length; m++) {
                dal.insertScoreTable(
                  [arr[m].user_id, req.body.courseid, arr1[0].task_id, 0],
                  (err) => {
                    if (err) console.log(err);
                  }
                );
              }
              res.redirect(`/trainer/dashboard/${req.body.token}`);
            }
          );
        });
      }
    );
  },
  deleteTask: (req, res) => {
    dal.deleteTask(req.body.taskid, (err) => {
      if (err) console.log(err);
      dal.deleteScore(req.body.taskid, (err) => {
        if (err) console.log(err);
      });
      res.redirect(`/trainer/dashboard/${req.body.token}`);
    });
  },
  editScore: (req, res) => {
    dal.editScore([req.body.score, req.body.scoreid], (err) => {
      if (err) console.log(err);
      res.redirect(
        `/trainer/view/submission/${req.body.token}/${req.body.taskname}/${req.body.traineename}/${req.body.scoreid}`
      );
    });
  },
  trainerCompleteCourse: (req, res) => {
    var currentdate = new Date();
    var datetime =
      currentdate.getFullYear() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getDate() +
      "/" +
      currentdate.getHours();
    dal.trainerCompleteCourse([2, datetime, req.body.courseid], (err) => {
      res.redirect(`/trainer/dashboard/${req.body.token}`);
    });
  },
  traineeDashboard: (req, res) => {
    dal.traineeDashboard(req.user.userid, (err, arr) => {
      if (err) console.log(err);
      res.render("./trainee/dashboard", {
        userid: req.user.userid,
        courseArr: arr,
        token: req.params.token,
      });
    });
  },
  traineeTasksView: (req, res) => {
    dal.selectTaskSpec(req.params.courseid, (err, arr) => {
      if (err) console.log(err);
      res.render("./trainee/taskPage", {
        userid: req.user.userid,
        courseid: req.params.courseid,
        taskArr: arr,
        token: req.params.token,
      });
    });
  },
  traineeDoTask: (req, res) => {
    dal.traineeDoTask(
      [req.user.userid, req.params.courseid, req.params.taskid],
      (err, arr) => {
        if (err) console.log(err);
        res.render("./trainee/submitTask", {
          userid: req.user.userid,
          courseid: req.params.courseid,
          taskid: req.params.taskid,
          flag: arr.length === 0 ? 0 : 1,
          sub: arr,
          token: req.params.token,
        });
      }
    );
  },
  traineeTaskSubmit: (req, res) => {
    dal.traineeTaskSubmit(
      [
        req.user.userid,
        req.body.taskid,
        req.body.courseid,
        req.body.content,
        Date(),
      ],
      (err) => {
        if (err) console.log(err);
        res.redirect(
          `/trainee/dotask/${req.body.token}/${req.body.courseid}/${req.body.taskid}`
        );
      }
    );
  },
  profile: (req, res) => {
    dal.profile(req.params.type, req.user.userid, function (err, arr) {
      if (err) console.log(err);
      else {
        res.render("profile", {
          profileDetails: arr[0],
          type: req.params.type,
          token: req.params.token,
        });
      }
    });
  },
  authenticateToken: (req, res, next) => {
    const token = req.params.token;
    if (token === null) return res.render("forbidden");
    dal.refreshTokenSelect(token, (err, arr) => {
      if (err || arr.length === 0) return res.render("forbidden");
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.render("forbidden");
        req.user = user;
        next();
      });
    });
  },
  authenticateTokenPost: (req, res, next) => {
    const token = req.body.token;
    if (token === null) return res.render("forbidden");
    dal.refreshTokenSelect(token, (err, arr) => {
      if (err || arr.length === 0) return res.render("forbidden");
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.render("forbidden");
        req.user = user;
        next();
      });
    });
  },
  forgotPasswordP: (req, res, next) => {
    const userid = req.body.userid;
    dal.selectCred(userid, (err, arr) => {
      if (err) console.log(err);
      if (arr.length > 0) {
        const secret = process.env.TOKEN_SECRET + arr[0].password;
        const payload = { email: arr[0].email, userid: arr[0].user_id };
        const tlink = jwt.sign(payload, secret, { expiresIn: "15m" });
        const link =
          process.env.mainLink + `/reset-password/${arr[0].user_id}/${tlink}`;
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENTID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
          },
        });
        let mailOptions = {
          from: process.env.MAIL_ID,
          to: arr[0].email,
          subject: "Reset Password - Steer",
          text: `Greetings, \n Click the link below to reset the password \n ${link} \n \n Thanks and Regards, \n Team Steer.`,
        };
        transporter.sendMail(mailOptions, function (err, data) {
          if (err) {
            console.log("Error " + err);
          } else {
            console.log("Email sent successfully");
          }
        });
        console.log(link);
        res.send(
          `The Password reset link has been set to your email address : ${arr[0].email}`
        );
      } else {
        res.send("<h1>No user with the ID</h1>");
      }
    });
  },
  resetPassword: (req, res) => {
    dal.selectCred(req.params.userid, (err, arr) => {
      if (err) console.log(err);
      if (arr.length > 0) {
        if (req.params.linkToken === null) return res.send("forbidden");
        const secret = process.env.TOKEN_SECRET + arr[0].password;
        jwt.verify(req.params.linkToken, secret, (err, payload) => {
          if (err || req.params.userid != payload.userid) {
            res.send("Link tampered");
            return;
          }
          res.render("reset-password", {
            userid: payload.userid,
            token: req.params.linkToken,
          });
        });
      } else {
        res.send("Link tampered");
      }
    });
  },
  passwordChange: async (req, res) => {
    const newhashedPassword = await bcrypt.hash(req.body.cpassword, 10);
    dal.selectCred(req.params.userid, (err, arr) => {
      if (err) console.log(err);
      if (arr.length > 0) {
        if (req.params.linkToken === null) return res.send("forbidden");
        const secret = process.env.TOKEN_SECRET + arr[0].password;
        jwt.verify(req.params.linkToken, secret, (err, payload) => {
          if (err || req.params.userid != payload.userid)
            res.send("Link tampered");
          dal.passwordChange([newhashedPassword, payload.userid], (err) => {
            if (err) console.log(err);
            else {
              res.send("Your password has been reset");
            }
          });
        });
      } else {
        res.send("Link tampered");
      }
    });
  },
  logout: (req, res) => {
    dal.refreshTokenDelete(req.body.token, (err) => {
      if (err) console.log(err);
      res.redirect("/");
    });
  },
};

module.exports = Controller;
