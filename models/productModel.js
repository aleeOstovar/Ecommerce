const mongoose = require('mongoose');
//const Category = require('./categoryModel');

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    pName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    colors: {
      type: [colorSchema],
    },
    images: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    ratingAvg: {
      type: Number,
      default: 4.5,
      min: [1, 'حداقل امتیاز 1'],
      max: [5, 'حداکثر امتیاز 5'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingQty: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
