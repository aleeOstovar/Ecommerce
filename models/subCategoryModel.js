/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
const farsiSlug = require('../utils/farsiSlug');

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
      type: String,
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

subcategorySchema.pre('save', function (next) {
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
subcategorySchema.pre(/^findOneAndUpdate|^findByIdAndUpdate/, function (next) {
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

const SubCategory = mongoose.model('SubCategory', subcategorySchema);
module.exports = SubCategory;
