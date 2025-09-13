import User from '../../models/user.model.js';
import ForgotPassword from '../../models/forgot-password.model.js';
import md5 from 'md5';

import * as generateHelper from '../../helpers/generate.helper.js';
import * as sendMailHelper from '../../helpers/sendMail.helper.js';

export const register = async (req, res) => {
  const user = req.body;

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if (existUser) {
    res.json({
      code: 'error',
      message: 'Email đã tồn tại trong hệ thống!'
    });
    return;
  }

  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: md5(user.password),
    token: generateHelper.generateRandomString(30)
  };

  const newUser = new User(dataUser);
  await newUser.save();

  res.json({
    code: 'success',
    message: 'Đăng ký thành công!',
    token: newUser.token
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const existUser = await User.findOne({
    email,
    deleted: false
  });

  if (!existUser) {
    res.json({
      code: 'error',
      message: 'Email không tồn tại trong hệ thống!'
    });
    return;
  }

  if (md5(password) !== existUser.password) {
    res.json({
      code: 'error',
      message: 'Sai mật khẩu!'
    });
    return;
  }

  res.json({
    code: 'success',
    message: 'Đăng nhập thành công!',
    token: existUser.token
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const existUser = await User.findOne({
    email,
    deleted: false
  });

  if (!existUser) {
    res.json({
      code: 'error',
      message: 'Email không tồn tại!'
    });
    return;
  }

  const existEmailInForgotPassword = await ForgotPassword.findOne({ email });

  if (!existEmailInForgotPassword) {
    const otp = generateHelper.generateRandomNumber(6);

    const data = {
      email,
      otp,
      expireAt: Date.now() + 5 * 60 * 1000
    };

    const record = new ForgotPassword(data);
    await record.save();

    const subject = 'Xác thực mã OTP';
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;

    sendMailHelper.sendMail(email, subject, text);
  }

  res.json({
    code: 'success',
    message: 'Gửi mã OTP thành công!'
  });
};

export const otpPassword = async (req, res) => {
  const { email, otp } = req.body;

  const existRecord = await ForgotPassword.findOne({ email, otp });

  if (!existRecord) {
    res.json({
      code: 'error',
      message: 'Mã OTP không hợp lệ!'
    });
    return;
  }

  const user = await User.findOne({ email });

  res.json({
    code: 'success',
    message: 'Mã OTP hợp lệ!',
    token: user.token
  });
};

export const resetPassword = async (req, res) => {
  const { password, token } = req.body;

  await User.updateOne(
    { token, deleted: false },
    { password: md5(password) }
  );

  res.json({
    code: 'success',
    message: 'Đổi mật khẩu thành công!'
  });
};

export const profile = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.json({
      code: 'error',
      message: 'Vui lòng gửi kèm theo token!'
    });
    return;
  }

  const user = await User.findOne({ token, deleted: false }).select('id fullName email');

  if (!user) {
    res.json({
      code: 'error',
      message: 'Token không hợp lệ!'
    });
    return;
  }

  res.json({
    code: 'success',
    message: 'Thành công!',
    data: user
  });
};
