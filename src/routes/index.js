const express = require("express");
const Controller = require("../controller");
const router = express.Router();


router.get("/", Controller.entry)
router.post("/", Controller.login);

router.get("/admin/dashboard/:token", Controller.authenticateToken, Controller.adminDashboard);
router.get("/admin/courses/:token", Controller.authenticateToken, Controller.adminCourses);
router.post("/addAdmin",Controller.authenticateTokenPost, Controller.addAdmin);
router.post("/deleteAdmin",Controller.authenticateTokenPost, Controller.deleteAdmin);
router.post("/addcourse",Controller.authenticateTokenPost, Controller.addCourse);
router.post("/deletecourse",Controller.authenticateTokenPost, Controller.deleteCourse);
router.get("/admin/trainers/:token/:flag", Controller.authenticateToken, Controller.adminTrainers);
router.post("/addtrainer",Controller.authenticateTokenPost, Controller.addTrainer);
router.post("/deletetrainer",Controller.authenticateTokenPost, Controller.deleteTrainer);
router.get("/admin/trainees/:token/:flag", Controller.authenticateToken, Controller.adminTrainees);
router.post("/addtrainee",Controller.authenticateTokenPost, Controller.addTrainee);
router.post("/deletetrainee",Controller.authenticateTokenPost, Controller.deleteTrainee);
router.post("/reassigntrainer",Controller.authenticateTokenPost, Controller.reassignTrainer);
router.get("/admin/scores/:token", Controller.authenticateToken, Controller.adminScores);
router.get("/admin/scores/:token/:courseid", Controller.authenticateToken, Controller.adminScoresSpecific);

router.get("/trainer/dashboard/:token", Controller.authenticateToken, Controller.trainerDashboard);
router.get("/trainer/task/:token/:taskname/:taskid/:courseid", Controller.authenticateToken, Controller.trainerTasks);
router.get("/trainer/view/submission/:token/:taskname/:traineename/:scoreid", Controller.authenticateToken, Controller.trainerViewSubmission);
router.post("/addtask",Controller.authenticateTokenPost, Controller.addTask);
router.post("/deletetask",Controller.authenticateTokenPost, Controller.deleteTask);
router.post("/score/edit",Controller.authenticateTokenPost, Controller.editScore);
router.post("/trainer/complete/course",Controller.authenticateTokenPost, Controller.trainerCompleteCourse);

router.get("/trainee/dashboard/:token", Controller.authenticateToken, Controller.traineeDashboard);
router.get("/trainee/tasks/:token/:courseid", Controller.authenticateToken, Controller.traineeTasksView);
router.get("/trainee/dotask/:token/:courseid/:taskid", Controller.authenticateToken, Controller.traineeDoTask);
router.post("/trainee/task/submit",Controller.authenticateTokenPost, Controller.traineeTaskSubmit);

router.post("/forgot-password", Controller.forgotPasswordP);

router.get("/reset-password/:userid/:linkToken", Controller.resetPassword);
router.post("/reset-password/:userid/:linkToken", Controller.passwordChange);
router.get("/profile/:token/:type", Controller.authenticateToken, Controller.profile);

router.post("/logout",Controller.logout)

module.exports = router;
