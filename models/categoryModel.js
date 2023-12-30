/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
const farsiSlug = require('../utils/farsiSlug');
const { getNextCustomId } = require('../utils/utility');

const categorySchema = new mongoose.Schema(
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
categorySchema.index({
  customId: 1,
  'slug.en': 'text',
  'slug.fa': 'text',
  'title.en': 'text',
  'title.fa': 'text',
  'description.en': 'text',
  'description.fa': 'text',
});
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
categorySchema.pre('save', async function (next) {
  if (this.isNew) {
    this.customId = await getNextCustomId(this.constructor);
  }
  next();
});
categorySchema.pre('save', function (next) {
  let titleEn = this.title.get('en');
  const titleFa = this.title.get('fa');

  if (!titleEn) titleEn = titleFa;

  const slugEn = slugify(titleEn, { lower: true });
  const slugFa = farsiSlug(titleFa);

  this.slug.en = slugEn;
  this.slug.fa = slugFa;

  next();
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
