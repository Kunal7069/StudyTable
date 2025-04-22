
const crypto = require('crypto');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/user");

// Generate Admission Number
const generateAdmissionNumber = () => "ADM" + Math.floor(100000 + Math.random() * 900000);

function generateRandomPassword(length = 8) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

// Token generation functions
const generateAccessToken = (payload) => jwt.sign(payload, process.env.ACCESS_SECRET, { expiresIn: "7d" });
const generateRefreshToken = (payload) => jwt.sign(payload, process.env.REFRESH_SECRET, { expiresIn: "30d" });

exports.signup = async (req, res) => {
  try {
    const {
      name,
      city,
      email,
      password,
      confirm_password,
      studentClass,
      marks,
      subjects,
      competitive_exams,
      about,
      location,
      mobileNumber,
      state,
      pinCode,
      boardMarksTarget,
      rankTarget,
      targetExams,
      board,
      boardName
    } = req.body;

    if (password !== confirm_password)
      return res.status(400).json({ message: "Passwords do not match" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const admissionNumber = generateAdmissionNumber();

    const student = new Student({
      admissionNumber,
      name,
      city,
      email,
      password: hashedPassword,
      class: studentClass,
      marks: {
        "10th": marks?.["10th"] || { maths: "0", science: "0" },
        "11th": ["11th", "12th"].includes(studentClass)
          ? marks?.["11th"] || { maths: "0", physics: "0", chemistry: "0" }
          : { maths: "0", physics: "0", chemistry: "0" },
        "12th": studentClass === "12th"
          ? marks?.["12th"] || { maths: "0", physics: "0", chemistry: "0" }
          : { maths: "0", physics: "0", chemistry: "0" }
      },
      subjects,
      competitive_exams,
      about,

      // Optional fields (can be null or undefined)
      location: location || null,
      mobileNumber: mobileNumber || null,
      state: state || null,
      pinCode: pinCode || null,
      boardMarksTarget: boardMarksTarget || null,
      rankTarget: rankTarget || null,
      targetExams: targetExams || null,
      board: board || null,
      boardName: boardName || null
    });

    await student.save();
    res.status(201).json({ message: "Your application has been submitted!", admissionNumber });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.updatePassword = async (req, res) => {
  try {
    const { admissionNumber, currentPassword, newPassword, confirmPassword } = req.body;

    if (!admissionNumber || !currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const student = await Student.findOne({ where: { admissionNumber } });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await student.update({ password: hashedNewPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePasswordWithoutCurrentPassword = async (req, res) => {
  try {
    const { admissionNumber } = req.body;

    if (!admissionNumber ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    
    const student = await Student.findOne({ where: { admissionNumber } });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const randomPassword = generateRandomPassword(); 
    const hashedNewPassword = await bcrypt.hash(randomPassword, 10);
    await student.update({ password: hashedNewPassword });

    res.status(200).json({ message: "Password updated successfully", new_password: randomPassword });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const {
      admissionNumber,
      password,
      confirm_password,
      marks,
      studentClass, // optional class change
    } = req.body;

    if (!admissionNumber) {
      return res.status(400).json({ message: "Admission number is required" });
    }

    const student = await Student.findOne({ where: { admissionNumber } });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Password validation and hashing
    if (password && confirm_password && password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const updateData = {};

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Handle simple fields
    const fieldsToUpdate = [
      "name", "city", "email", "subjects", "competitive_exams", "about",
      "location", "mobileNumber", "state", "pinCode", "boardMarksTarget",
      "rankTarget", "targetExams", "board", "boardName"
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Update class if provided
    if (studentClass) {
      updateData.class = studentClass;
    }

    // Update marks if provided
    if (marks) {
      updateData.marks = {
        ...student.marks, // retain existing marks
        ...(marks["10th"] ? { "10th": marks["10th"] } : {}),
        ...(marks["11th"] ? { "11th": marks["11th"] } : {}),
        ...(marks["12th"] ? { "12th": marks["12th"] } : {})
      };
    }

    // Final update
    await student.update(updateData);

    res.status(200).json({ message: "Student information updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getStudentDetails = async (req, res) => {
  try {
    const { admissionNumber } = req.params;

    if (!admissionNumber) {
      return res.status(400).json({ message: "Admission number is required" });
    }

    const student = await Student.findOne({
      where: { admissionNumber },
      attributes: { exclude: ["password"] }, // Exclude password from response
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { admissionNumber, password } = req.body;
    const student = await Student.findOne({ where: { admissionNumber } });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: student._id, role: "student" };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: "Login successful",
      accessToken,
      refreshToken,
      student
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken || !refreshToken) {
      return res.status(401).json({ message: "Both tokens are required" });
    }

    // Verify the refresh token first
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (refreshErr, refreshDecoded) => {
      if (refreshErr) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Try to decode the access token to get user info (even if it's expired)
      const decoded = jwt.decode(accessToken);

      if (!decoded || decoded.id !== refreshDecoded.id) {
        return res.status(403).json({ message: "Token mismatch or invalid access token" });
      }

      // Generate new access token
      const newAccessToken = jwt.sign(
        { id: decoded.id, role: refreshDecoded.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "7d" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ valid: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ valid: false, message: "Invalid or expired token" });
      }

      res.status(200).json({ valid: true, message: "Token is valid", decoded });
    });
  } catch (error) {
    res.status(500).json({ valid: false, error: error.message });
  }
};


exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUsername = "admin";
    const adminPassword = "admin";

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { role: "admin" };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      message: "Admin login successful",
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
