const express = require('express');
const subCategoryRouter = require('./subCategoryRoutes');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const Uploader = require('../controllers/uploadController');

const router = express.Router();

router.route('/').get(categoryController.getAllCategory);
router.route('/:id').get(categoryController.getCategory);

// router.use('/:categoryId/subCategory', subCategoryRouter);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'siteAdmin')
);
// Uploader.uploadSinglePhoto,
// Uploader.resizeSinglePhoto,
router.route('/').post(categoryController.createCategory);
router
  .route('/:id')
  .patch(categoryController.updateCategory)
  .delete(categoryController.deleteCategory);

module.exports = router;
