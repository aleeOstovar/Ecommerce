const mongoose = require('mongoose');
const Product = require('./productModel');
//const shortid = require('shortid');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, ' please write a review '],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: [true, 'a review must to belong to a product'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'a review must to belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: 'pName',
  }).populate({
    path: 'user',
    select: 'firstName lastName photo',
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (productId) {
  productId = productId._id ? productId._id : productId;
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingQty: stats[0].nRating,
      ratingAvg: stats[0].avgRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingQty: 0,
      ratingAvg: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
