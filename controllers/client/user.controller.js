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


module.exports.otpPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if(!existRecord) {
    res.json({
      code: "error",
      message: "Mã OTP không hợp lệ!"
    });
    return;
  }

  const user = await User.findOne({
    email: email
  });

  res.json({
    code: "success",
    message: "Mã OTP hợp lệ!",
    token: user.token
  });
}

module.exports.resetPassword = async (req, res) => {
  const password = req.body.password;
  const token = req.body.token;

  await User.updateOne({
    token: token,
    // status: "active",
    deleted: false
  }, {
    password: md5(password)
  });

  res.json({
    code: "success",
    message: "Đổi mật khẩu thành công!"
  });
}

module.exports.profile = async (req, res) => {
  const token = req.body.token;

  if(!token) {
    res.json({
      code: "error",
      message: "Vui lòng gửi kèm theo token!"
    });
    return;
  }

  const user = await User.findOne({
    token: token,
    deleted: false
  }).select("id fullName email");

  if(!user) {
    res.json({
      code: "error",
      message: "Token không hợp lệ!"
    });
    return;
  }

  res.json({
    code: "success",
    message: "Thành công!",
    data: user
  });
}