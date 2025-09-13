import express from 'express';
import {
  register,
  login,
  forgotPassword,
  otpPassword,
  resetPassword,
  profile
} from '../../controllers/client/user.controller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/password/forgot', forgotPassword);
router.post('/password/otp', otpPassword);
router.post('/password/reset', resetPassword);
router.get('/profile', profile);

export default router;
