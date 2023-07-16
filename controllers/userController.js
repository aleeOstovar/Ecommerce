const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

// Helper function to filter out unwanted field names from an object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getIt = catchAsync(async (req, res, next) => {
  const doc = await User.find({});

  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc },
  });
});

//* CRUD APIs
exports.getAllUsers = Factory.getAll(User);
exports.getUser = Factory.getOne(User);
exports.createUser = Factory.createOne(User);
exports.updateUser = Factory.updateOne(User);
exports.deleteUser = Factory.deleteOne(User);

// using this middleware to make user be able to get his/her profile api
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

//make api for user to update his/her profile datas.

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError(400, 'This route is not for password updates.'));
  }
  // 2) filltered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'lastName',
    'phoneNumber',
    'nationalCode',
    'photo'
  );
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) update user profile
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    return next(new AppError(404, 'User not found.'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// api for user to deactive(delete) his/her account
exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) Find the user and update the 'active' field to false
  const user = await User.findByIdAndUpdate(req.user._id, { active: false });

  // 2) Handle case where user is not found
  if (!user) {
    return next(new AppError(404, 'User not found'));
  }

  // 3) Send response
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
