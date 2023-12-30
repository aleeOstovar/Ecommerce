/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilterPhoto = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError(400, 'please Upload only image'), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilterPhoto,
});

exports.uploadSinglePhoto = upload.single('coverImage');

// exports.uploadMultiplePhoto = upload.array('images');
exports.uploadMultiplePhoto = upload.fields([
  { name: 'coverImage' },
  { name: 'images' },
]);

exports.resizeSinglePhoto = catchAsync(async (req, res, next) => {
  //   let width = 1500;
  //   let heights = 500;
  if (!req.file) {
    // No file uploaded, proceed to the next middleware
    return next();
  }
  const route = req.originalUrl.split('/')[1].replace('/', ' ').split(' ')[0];
  const time = moment(Date.now()).format('YYYY-MM-DD-HH-mm');
  req.file.filename = `${route}-${req.user.customId}-${time}`;
  const dir = `public/img/${route}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!req.file) return next();
  sharp.cache(false);
  const sizes = {
    small: 300,
    medium: 600,
    large: 1200,
  };
  const imagesPath = {};
  for (const size in sizes) {
    const filePath = path
      .join(dir, `${req.file.filename}-${size}.jpeg`)
      .replace(/\\/g, '/');
    await sharp(req.file.buffer)
      .resize(sizes[size], sizes[size])
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(filePath);
    imagesPath[size] = filePath;
  }
  req.file.filename = imagesPath;
  next();
});

exports.resizeMultipleImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  //processing cover image
  const route = req.originalUrl.split('/')[1].replace('/', ' ').split(' ')[0];

  const dir = `/public/img/${route}`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const time = moment(Date.now()).format('YYYY-MM-DD-HH-mm');
  const tagName = `${route}-${Math.floor(
    1000000 + Math.random() * 9000000
  )}-${time}`;

  req.body.coverImage = `${tagName}-cover.jpeg`;
  await sharp(req.files.coverImage[0].buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${dir}/${req.body.coverImage}`);
  //processing other images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `${tagName}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`${dir}/${filename}`);

      req.body.images.push(filename);
    })
  );
  // req.body.coverImage = req.body.images[0];

  next();
});
