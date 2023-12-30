/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
const farsiSlug = require('../utils/farsiSlug');
const { getNextCustomId } = require('../utils/utility');

const subcategorySchema = new mongoose.Schema(
  {
    title: {
      type: Map,
      of: String,
      validate: {
        validator: function (value) {
          return value && (value.get('fa') || value.get('en'));
        },
        message: 'At least a Farsi or English title is required',
      },
      required: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    slug: {
      en: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        strict: true,
      },
      fa: {
        type: String,
        unique: true,
        lowercase: true,
        index: true,
        strict: true,
      },
    },
    coverImage: {
      small: { type: String, default: 'public/img/noImage-small.jpg' },
      medium: { type: String, default: 'public/img/noImage-medium.jpg' },
      large: { type: String, default: 'public/img/noImage-large.jpg' },
    },
    customId: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// subcategorySchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'category',
//     select: 'name',
//   });
//   next();
// });
subcategorySchema.virtual('products', {
  ref: 'Product',
  foreignField: 'subCategory',
  localField: '_id',
});
subcategorySchema.pre('save', async function (next) {
  if (this.isNew) {
    this.customId = await getNextCustomId(this.constructor);
  }
  next();
});

subcategorySchema.pre('save', function (next) {
  let titleEn = this.title.get('en');
  const titleFa = this.title.get('fa');

  if (!titleEn) titleEn = titleFa;

  const slugEn = slugify(titleEn, { lower: true });
  const slugFa = farsiSlug(titleFa);

  this.slug.en = slugEn;
  this.slug.fa = slugFa;

  next();
});

const SubCategory = mongoose.model('SubCategory', subcategorySchema);
module.exports = SubCategory;
