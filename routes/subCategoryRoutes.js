const express = require('express');
const authController = require('../controllers/authController');
const subCategoryController = require('../controllers/subCategoryController');
const Uploader = require('../controllers/uploadController');

const router = express.Router();

router.route('/').get(subCategoryController.getAllSubCategories);
router.route('/:subCatId').get(subCategoryController.getSubCategory);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'siteAdmin')
);
// Uploader.uploadSinglePhoto,
//     Uploader.resizeSinglePhoto,
router.route('/').post(subCategoryController.createSubCategory);
router
  .route('/:subCatId')
  .patch(subCategoryController.updateSubCategory)
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
