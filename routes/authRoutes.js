const express = require("express");
const { signup, login , updateStudent,adminLogin,refreshToken,verifyToken,getStudentDetails,updatePassword} = require("../controllers/authController");


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update", updateStudent);
router.post("/admin-login", adminLogin);
router.post("/refreshToken",refreshToken);
router.get("/verifyToken", verifyToken);
router.get("/getStudentDetails/:admissionNumber", getStudentDetails);
router.post("/update-password",updatePassword)


module.exports = router;
