/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
const { farsiSlug } = require('../utils/farsiSlug');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'please enter category name'],
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
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
categorySchema.virtual('subCategories', {
  ref: 'SubCategory',
  foreignField: 'category',
  localField: '_id',
});
categorySchema.virtual('products', {
  ref: 'Product',
  foreignField: 'category',
  localField: '_id',
});
categorySchema.pre('save', function (next) {
  const titleEn = this.title.get('en');
  const titleFa = this.title.get('fa');

  const slugEn = slugify(titleEn, { lower: true });
  const slugFa = farsiSlug(titleFa);
  const slugEnRegex = new RegExp(`^(${slugEn})((-[0-9]+)?)$`, 'i');
  const slugFaRegex = new RegExp(`^(${slugFa})((-[0-9]+)?)$`, 'i');
  const model = this.constructor;

  model
    .countDocuments({
      $or: [{ 'slug.en': slugEnRegex }, { 'slug.fa': slugFaRegex }],
    })
    .then((count) => {
      if (count > 0) {
        this.slug.en = `${slugEn}-${count}`;
        this.slug.fa = `${slugFa}-${count}`;
      } else {
        this.slug.en = slugEn;
        this.slug.fa = slugFa;
      }
      next();
    })
    .catch((error) => {
      next(error);
    });
});
categorySchema.pre(/^findOneAndUpdate|^findByIdAndUpdate/, function (next) {
  if (this._update.title) {
    const titleEn = this._update.title.en;
    const titleFa = this._update.title.fa;

    const slugEn = slugify(titleEn, { lower: true });
    const slugFa = farsiSlug(titleFa);

    this._update.slug = {
      en: slugEn,
      fa: slugFa,
    };
  }

  next();
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
