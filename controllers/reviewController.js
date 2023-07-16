const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
//const AppError = require('../utils/appError');
const Factory = require('./handlerFactory');

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const filter = req.user.id;
  const features = new APIFeatures(
    Review.find({ user: filter }),
    req.query
  ).paginate();
  const doc = await features.query;
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: { doc },
  });
});

exports.getAllReviews = Factory.getAll(Review);

exports.getReview = Factory.getOne(Review);

exports.setproductUserId = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = Factory.createOne(Review);

exports.updateReview = Factory.updateOne(Review);

exports.deleteReview = Factory.deleteOne(Review);
