/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
const farsiSlug = require('../utils/farsiSlug');
// const translateValue = require('../utils/translatorModule');
// const catchAsync = require('../utils/catchAsync');

const colorSchema = new mongoose.Schema({
  name: {
    type: Map,
    of: String,
    validator: function (value) {
      return value && (value.fa || value.en);
    },
  },
  code: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    default: 0,
  },
});

const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
  },
  icon: {
    type: String,
  },
  colors: [colorSchema],
});

const productSchema = new mongoose.Schema(
  {
    title: {
      type: Map,
      of: String,
      validate: {
        validator: function (value) {
          return value && (value.fa || value.en);
        },
      },
    },
    description: {
      type: Map,
      of: String,
      validate: {
        validator: function (value) {
          return value && (value.fa || value.en);
        },
      },
    },
    sizes: [sizeSchema],
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
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
    shipping: {
      type: String,
      enum: ['yes', 'no'],
    },
    images: {
      type: [String],
      required: false,
    },
    brand: {
      type: String,
      required: false,
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

// Indexes for text search
productSchema.index({
  price: 1,
  ratingAvg: -1,
  slug: 1,
  'title.en': 'text',
  'title.fa': 'text',
  'description.en': 'text',
  'description.fa': 'text',
});

productSchema.pre('save', function (next) {
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
productSchema.pre(/^findOneAndUpdate|^findByIdAndUpdate/, function (next) {
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
// productSchema.pre(
//   'save',
//   catchAsync(async function (next) {
//     const langToTranslate = 'fa';
//     const targetLang = 'en';

//     if (this.title[langToTranslate] && this.description[langToTranslate]) {
//       const titleValue = this.title[langToTranslate];
//       const descriptionValue = this.description[langToTranslate];

//       if (!this.title[targetLang]) {
//         // Translate Farsi title to English
//         const [translatedTitle, translatedDescription] = await Promise.all([
//           translateValue(titleValue, langToTranslate, targetLang),
//           translateValue(descriptionValue, langToTranslate, targetLang),
//         ]);

//         this.title[targetLang] = translatedTitle;
//         this.description[targetLang] = translatedDescription;
//         this.slug = slugify(translatedTitle, { lower: true });
//         this.slugFa = farsiSlug(titleValue);
//         delete this.title[langToTranslate];
//         delete this.description[langToTranslate];
//       } else {
//         // English title is already present, generate slugs directly
//         this.slug = slugify(this.title[targetLang], { lower: true });
//         this.slugFa = farsiSlug(titleValue);
//       }
//     }

//     next();
//   })
// );

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
