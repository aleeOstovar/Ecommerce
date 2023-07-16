const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
//!const uploader = require('../utils/uploader');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: List of All APIs on Products Route
 * /products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all Products
 *     description: Retrieves all products.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 *   post:
 *     tags:
 *       - Products
 *     summary: Create a new product
 *     description: Creates a new product with the given details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: title.fa
 *         description: Title of the product in Persian (Farsi)
 *         required: true
 *         type: string
 *       - in: formData
 *         name: title.en
 *         description: Title of the product in English
 *         required: true
 *         type: string
 *       - in: formData
 *         name: description.fa
 *         description: Description of the product in Persian (Farsi)
 *         required: true
 *         type: string
 *       - in: formData
 *         name: description.en
 *         description: Description of the product in English
 *         required: true
 *         type: string
 *       - in: formData
 *         name: price
 *         description: Price of the product
 *         required: true
 *         type: number
 *       - in: path
 *         name: category
 *         description: ID of the category
 *         required: true
 *         type: string
 *       - in: path
 *         name: subCategory
 *         description: ID  of the subCategory
 *         required: true
 *         type: string
 *       - in: formData
 *         name: shipping
 *         description: Shipping availability (yes or no)
 *         required: true
 *         type: string
 *       - in: formData
 *         name: images
 *         description: Array of product images
 *         required: true
 *         type: array
 *         items:
 *           type: file
 *       - in: formData
 *         name: brand
 *         description: Brand of the product
 *         required: true
 *         type: string
 *       - in: formData
 *         name: sizes
 *         description: Array of product sizes
 *         required: true
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/Size'
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 * /products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product by ID
 *     description: Retrieves a product based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *
 *   patch:
 *     tags:
 *       - Products
 *     summary: Update a product
 *     description: Updates a product based on the given details.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: string
 *       - in: formData
 *         name: title.fa
 *         description: Updated title of the product in Persian (Farsi)
 *         required: false
 *         type: string
 *       - in: formData
 *         name: title.en
 *         description: Updated title of the product in English
 *         required: false
 *         type: string
 *       - in: formData
 *         name: description.fa
 *         description: Updated description of the product in Persian (Farsi)
 *         required: false
 *         type: string
 *       - in: formData
 *         name: description.en
 *         description: Updated description of the product in English
 *         required: false
 *         type: string
 *       - in: formData
 *         name: price
 *         description: Updated price of the product
 *         required: false
 *         type: number
 *       - in: formData
 *         name: category
 *         description: Updated ID of the category
 *         required: false
 *         type: string
 *       - in: formData
 *         name: subCategory
 *         description: Updated ID of the subcategory
 *         required: false
 *         type: string
 *       - in: formData
 *         name: shipping
 *         description: Updated shipping availability (yes or no)
 *         required: false
 *         type: string
 *       - in: formData
 *         name: images
 *         description: Updated array of product images
 *         required: false
 *         type: array
 *         items:
 *           type: file
 *       - in: formData
 *         name: brand
 *         description: Updated brand of the product
 *         required: false
 *         type: string
 *       - in: formData
 *         name: sizes
 *         description: Updated array of product sizes
 *         required: false
 *         type: array
 *         items:
 *           $ref: '#/components/schemas/Size'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product
 *     description: Deletes a product based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         title:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             fa:
 *               type: string
 *         description:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             fa:
 *               type: string
 *         category:
 *           type: string
 *         subCategory:
 *           type: string
 *         shipping:
 *           type: string
 *         price:
 *           type: number
 *         sizes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Size'
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         brand:
 *           type: string
 *
 *     Size:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *         colors:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Color'
 *
 *     Color:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: object
 *           properties:
 *             en:
 *               type: string
 *             fa:
 *               type: string
 *         qty:
 *           type: number
 */

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'siteAdmin'),
    productController.createProduct
  );

router.route('/:id').get(productController.getProduct);

router.use(
  authController.protect,
  authController.restrictTo('admin', 'siteAdmin')
);

// get/update/delete a user
//! dont forget to restrict to super admin user
router
  .route('/:id')
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
