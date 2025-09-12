const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");

const generateHelper = require("../../helpers/generate.helper");
const sendMailHelper = require("../../helpers/sendMail.helper");

module.exports.register = async (req, res) => {
  const user = req.body;

  const existUser = await User.findOne({
    email: user.email,
    deleted: false
  });

  if(existUser) {
    res.json({
      code: "error",
      message: "Email đã tồn tại trong hệ thống!"
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
    code: "success",
    message: "Đăng ký thành công!",
    token: newUser.token
  })
}

module.exports.login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const existUser = await User.findOne({
    email: email,
    deleted: false
  });

  if(!existUser) {
    res.json({
      code: "error",
      message: "Email không tồn tại trong hệ thống!"
    });
    return;
  }

  if(md5(password) != existUser.password) {
    res.json({
      code: "error",
      message: "Sai mật khẩu!"
    });
    return;
  }

  // if(existUser.status != "active") {
  //   res.json({
  //     code: "error",
  //     message: "Tài khoản đang bị khóa!"
  //   });
  //   return;
  // }

  res.json({
    code: "success",
    message: "Đăng nhập thành công!",
    token: existUser.token
  })
}

module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;

  const existUser = await User.findOne({
    email: email,
    // status: "active",
    deleted: false
  });

  if(!existUser) {
    res.json({
      code: "error",
      message: "Email không tồn tại!"
    });
    return;
  }

  // Việc 1: Lưu email và mã OTP vào database
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email
  });

  if(!existEmailInForgotPassword) {
    const otp = generateHelper.generateRandomNumber(6);

    const data = {
      email: email,
      otp: otp,
      expireAt: Date.now() + 5*60*1000
    };
  
    const record = new ForgotPassword(data);
    await record.save();
  
    // Việc 2: Gửi mã OTP qua email cho user
    const subject = "Xác thực mã OTP";
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;

    sendMailHelper.sendMail(email, subject, text);
  }

  res.json({
    code: "success",
    message: "Gửi mã OTP thành công!"
  })
}