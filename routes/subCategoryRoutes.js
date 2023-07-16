const express = require('express');
const authController = require('../controllers/authController');
const subCategoryController = require('../controllers/subCategoryController');
const Uploader = require('../controllers/uploadController');

const router = express.Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   - name: SubCategories
 *     description: List of All APIs on SubCategories Route
 * /subcategories:
 *   get:
 *     tags:
 *       - SubCategories
 *     summary: Get all SubCategories
 *     description: Retrieves all SubCategories.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategory'
 *   post:
 *     tags:
 *       - SubCategories
 *     summary: Create a new subcategory
 *     description: Creates a new subcategory with the given details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title.fa
 *         description: Name of the subCategory in Farsi
 *         required: true
 *         type: string
 *       - in: formData
 *         name: title.en
 *         description: Name of the subCategory in english
 *         required: false
 *         type: string
 *       - in: formData
 *         name: category
 *         description: ID or slug of the category
 *         required: true
 *         type: string
 *       - in: formData
 *         name: coverImage
 *         description: Cover image of the subCategory
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Subcategory created successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 *
 *   delete:
 *     tags:
 *       - SubCategories
 *     summary: Delete all SubCategories
 *     description: Deletes all subcategory records in the database.
 *     responses:
 *       200:
 *         description: SubCategories deleted successfully
 *
 * /subcategories/{id}:
 *   get:
 *     tags:
 *       - SubCategories
 *     summary: Get a category by ID
 *     description: Retrieves a subCategory based on the given ID or Slug.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID or Slug of the subCategory
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/subCategoryModel'
 *       404:
 *         description: subCategory not found
 *
 *   patch:
 *     tags:
 *       - SubCategories
 *     summary: Update a subcategory
 *     description: Updates a subcategory based on the given details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subCategory
 *         schema:
 *           type: string
 *       - in: formData
 *         name: title.fa
 *         description: Name of the subCategory in Farsi
 *         required: true
 *         type: string
 *       - in: formData
 *         name: title.en
 *         description: Name of the subCategory in english
 *         required: false
 *         type: string
 *       - in: path
 *         name: category
 *         description: ID of category
 *         required: false
 *         type: string
 *       - in: formData
 *         name: coverImage
 *         description: Image of the subCategory
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 *   delete:
 *     tags:
 *       - SubCategories
 *     summary: Delete a subcategory
 *     description: Deletes a subcategory based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the subcategory
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 * components:
 *   schemas:
 *     Subcategory:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         coverImage:
 *           type: string
 */

router.route('/').get(subCategoryController.getAllSubCategories);
router.route('/:id').get(subCategoryController.getSubCategory);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'siteAdmin')
);

router
  .route('/')
  .post(
    Uploader.uploadSinglePhoto,
    Uploader.resizeSinglePhoto,
    subCategoryController.uploadSubCategoryImage,
    subCategoryController.createSubCategory
  )
  .delete(
    authController.restrictTo('admin'),
    subCategoryController.deleteAllSubCategories
  );
router
  .route('/:id')
  .patch(
    Uploader.uploadSinglePhoto,
    Uploader.resizeSinglePhoto,
    subCategoryController.uploadSubCategoryImage,
    subCategoryController.updateSubCategory
  )
  .delete(subCategoryController.deleteSubCategory);

module.exports = router;
