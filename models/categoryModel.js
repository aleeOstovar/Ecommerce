const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    subcategories: {
      type: mongoose.Schema.ObjectId,
      ref: 'SubCategory',
    },
    coverImage: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// categorySchema.virtual('subCategories', {
//   ref: 'SubCategory',
//   foreignField: 'subCategories',
//   localField: '_id',
// });
// categorySchema.virtual('products', {
//   ref: 'Product',
//   foreignField: 'product',
//   localField: '_id',
// });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
