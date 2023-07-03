//const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: process.env.JWT_EXP_IN,
  });
const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXP_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  });
  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

//signup function
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
    confPassword: req.body.confPassword,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
  });
  createSendToken(newUser, 200, req, res);
});
//login function
exports.logIn = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;
  // Check if userName or password is entered
  if (!userName || !password) {
    return next(new AppError(400, 'Username or password is not entered'));
  }

  // Check if username or email is existed
  const user = await User.findOne({ userName }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError(401, 'Username or password is wrong'));
  }

  // If everything is okay, create and send token in the response
  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(401, 'you are not logged in! plese log in to get access')
    );
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWTSECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(401, 'This user and  token does no longer exist.')
    );
  }
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError(401, 'User recently changed password! Please log in again.')
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, '***access forbiden message***'));
    }
    next();
  };

//! dont forget to impelement these
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError(404, '*** user not found with this email***'));
  }
  //generate reset Tokone
  const resetToken = user.createPasswordResetToken();
  //console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    // user.passwordResetToken = undefined;
    // user.passwordResetExpires = undefined;
    // await user.save({ validateBeforeSave: false });

    return next(new AppError(500, 'unwanted problem text'));
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExp: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }
  user.password = req.body.password;
  user.confPassword = req.body.confPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExp = undefined;
  await user.save();

  // 4) Log the user in, send JWT
  createSendToken(user, 200, req, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  //get user
  const { currentPassword, newPassword, newConfPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');
  //cheching password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(401, '***wrong password ***');
  }
  //update password
  user.password = newPassword;
  user.confPassword = newConfPassword;
  await user.save();
  //login user
  createSendToken(user, 200, req, res);
});
exports.changeRole = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  // Find the user by userId
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ status: 'error', message: 'User not found' });
  }

  // Update the user's role
  user.role = role;
  await user.save();

  res.json({
    status: 'success',
    data: {
      user: user.userName,
      role: user.role,
    },
  });
});
