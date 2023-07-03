/* eslint-disable import/no-extraneous-dependencies */
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
// const path = require('path');
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

  const route = req.originalUrl.split('/')[1].replace('/', ' ').split(' ')[0];
  req.file.filename = `${route}-${req.user.id}-${Date.now()}.jpeg`;
  const dir = `public/img/${route}`;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (!req.file) return next();
  sharp.cache(false);
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`${dir}/${req.file.filename}`);
  next();
});

exports.resizeMultipleImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  //processing cover image
  const route = req.originalUrl.split('/')[1].replace('/', ' ').split(' ')[0];

  const dir = `public/img/${route}`;

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const tagName = `${route}-${Math.floor(
    100000000 + Math.random() * 900000000
  )}-${Date.now()}`;

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
