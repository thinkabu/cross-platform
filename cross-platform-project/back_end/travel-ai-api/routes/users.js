const express = require("express");
const router = express.Router();
const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const nodemailer = require("nodemailer");
// get all
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// register
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra nếu đã tồn tại user
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Validate input
    if (!name || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu" 
      });
    }

    // Tìm user theo tên
    const user = await User.findOne({ name });

    // Kiểm tra nếu user không tồn tại hoặc sai mật khẩu
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Sai tên đăng nhập hoặc mật khẩu"
      });
    }

    // So sánh password đã hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Sai tên đăng nhập hoặc mật khẩu"
      });
    }

    // Tạo token
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // token hết hạn sau 1 ngày
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Lỗi hệ thống, vui lòng thử lại sau",
      error: error.message 
    });
  }
});

// get user info
router.get("/info", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // bỏ password
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update user info
router.put("/update", verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true }
    ).select("-password"); // bỏ password
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// change password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Tìm user theo ID
    const user = await User.findById(userId);

    // Kiểm tra mật khẩu cũ
    const isValidPassword = await bcrypt.compare(oldPassword, user.password);
    // Nếu mật khẩu cũ không đúng
    if (!isValidPassword) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }
    // Hash mật khẩu mới
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    // Cập nhật mật khẩu mới
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedNewPassword },
      { new: true }
    );
    // Trả về thông tin user đã cập nhật (không bao gồm mật khẩu)
    res.json({
      message: "Cập nhật mật khẩu thành công",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Received email:", email);

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", otp);

    // Save OTP and expiration time to the user record
    user.resetOtp = otp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();


    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Mã OTP để đặt lại mật khẩu",
      text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`,
    };

    console.log("Sending email...");
    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully");

    res.status(200).json({ message: "OTP đã được gửi đến email của bạn" });
  } catch (error) {
    console.error("Error in /forgot-password:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
});

// verify-otp
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Log the received OTP and stored OTP for debugging
    console.log("Received OTP:", otp);
    console.log("Stored OTP:", user.resetOtp);
    console.log("OTP Expiration Time:", user.resetOtpExpires);
    console.log("Current Time:", Date.now());

    // Check if the OTP is correct
    if (parseInt(user.resetOtp) !== parseInt(otp)) {
      return res.status(400).json({ message: "OTP không hợp lệ" });
    }

    // Check if the OTP has expired
    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    res.status(200).json({ message: "OTP hợp lệ" });
  } catch (error) {
    console.error("Error in /verify-otp:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
});

// reset-password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Validate input
    if (!newPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không được để trống" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Check if the OTP is correct
    if (parseInt(user.resetOtp) !== parseInt(otp)) {
      return res.status(400).json({ message: "OTP không hợp lệ" });
    }

    // Check if the OTP has expired
    if (Date.now() > user.resetOtpExpires) {
      return res.status(400).json({ message: "OTP đã hết hạn" });
    }

    // Hash the new password
    const saltRounds = 10;
    user.password = await bcrypt.hash(newPassword, saltRounds);

    // Clear the OTP fields
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    console.error("Error in /reset-password:", error);
    res.status(500).json({ message: "Đã xảy ra lỗi", error: error.message });
  }
});
module.exports = router;
