const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
//!const uploader = require('../utils/uploader');

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/productModel'
 *   post:
 *     summary: Create a product
 *     description: Create a new product
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 * /products/{id}:
 *   get:
 *     summary: Get a product
 *     description: Returns a product based on its ID
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
 *               $ref: './models/productModel'
 *   patch:
 *     summary: Update a product
 *     description: Update a product based on its ID
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
 *               $ref: './models/productModel'
 *   delete:
 *     summary: Delete a product
 *     description: Delete a product based on its ID
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
 *               $ref: './models/productModel'
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
