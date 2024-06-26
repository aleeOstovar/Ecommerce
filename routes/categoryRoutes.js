const express = require('express');
// const subCategoryRouter = require('./subCategoryRoutes');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const subCategoryRouter = require('./subCategoryRoutes');
const productRouter = require('./productRoutes');
const Uploader = require('../controllers/uploadController');

const router = express.Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   - name: Categories
 *     description: List of All APIS on Categories Route
 * /categories:
 *   get:
 *     tags:
 *       -  Categories
 *     summary: Get all categories
 *     description: Retrieves all categories.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/categoryModel'
 *
 *   post:
 *     tags:
 *       -  Categories
 *     summary: Create a new category
 *     description: Creates a new category with the given details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title.fa
 *         description: Name of the category in Farsi
 *         required: true
 *         type: string
 *       - in: formData
 *         name: title.en
 *         description: Name of the category in English
 *         required: false
 *         type: string
 *       - in: formData
 *         name: coverImage
 *         description: Cover image of the category
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Category created successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 * /categories/{id}:
 *   get:
 *     tags:
 *       -  Categories
 *     summary: Get a category by ID
 *     description: Retrieves a category based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/categoryModel'
 *       404:
 *         description: Category not found
 *
 *   patch:
 *     tags:
 *       -  Categories
 *     summary: Update a category
 *     description: Updates a category based on the given details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: formData
 *         name: title.fa
 *         description: Title of the category in Persian (Farsi)
 *         required: false
 *         type: string
 *       - in: formData
 *         name: title.en
 *         description: Title of the category in English
 *         required: false
 *         type: string
 *       - in: formData
 *         name: coverImage
 *         description: Image of the category
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/categoryModel'
 *
 *   delete:
 *     tags:
 *       -  Categories
 *     summary: Delete a category
 *     description: Deletes a category based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID or slug of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: category deleted successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 *
 */

router.route('/').get(categoryController.getAllCategory);
router.route('/:id').get(categoryController.getCategory);

router.use('/:categoryId/subCategory', subCategoryRouter);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'siteAdmin')
);

router
  .route('/')
  .post(
    Uploader.uploadSinglePhoto,
    Uploader.resizeSinglePhoto,
    categoryController.uploadCategoryImage,
    categoryController.createCategory
  );
router
  .route('/:id')
  .patch(
    Uploader.uploadSinglePhoto,
    Uploader.resizeSinglePhoto,
    categoryController.uploadCategoryImage,
    categoryController.updateCategory
  );
router.route('/:id').delete(categoryController.deleteCategory);

router.use('/:categoryId/subCategory', subCategoryRouter);
//nested route on product
router.use('/subCatId/products', productRouter);
module.exports = router;
