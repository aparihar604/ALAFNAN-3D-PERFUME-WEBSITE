const express = require('express');
const AuthController = require('../fronted_controller/auth_controller');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage(); // Store in memory (or you can configure disk storage)
const upload = multer({ storage });

router.post('/register', AuthController.create_user);
router.post('/login', AuthController.login_user);
router.post('/  ', AuthController.verify_otp);
router.post('/resend-otp', AuthController.resend_otp);
router.get('/users', AuthController.get_all_users);
router.get('/user/:id', AuthController.get_single_user);

// router.post('forgot-password', AuthController.forgot_password);

module.exports = router;
