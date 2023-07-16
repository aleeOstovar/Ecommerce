const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: List of All APIS on Reviews Route
 * /reviews:
 *   get:
 *     tags:
 *       -  Reviews
 *     summary: Get all reviews
 *     description: Retrieves all reviews.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *
 *   post:
 *     tags:
 *       -  Reviews
 *     summary: Create a new review
 *     description: Creates a new review with the given details.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: review
 *         description: Review object containing review, rating, product, and user details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             review:
 *               type: string
 *             rating:
 *               type: number
 *             product:
 *               type: string
 *             user:
 *               type: string
 *     responses:
 *       200:
 *         description: Review created successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 * /reviews/{id}:
 *   get:
 *     tags:
 *       -  Reviews
 *     summary: Get a review by ID
 *     description: Retrieves a review based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *
 *   patch:
 *     tags:
 *       -  Reviews
 *     summary: Update a review
 *     description: Updates a review based on the given details.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review
 *         schema:
 *           type: string
 *       - in: body
 *         name: review
 *         description: Review object containing review, rating, product, and user details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             review:
 *               type: string
 *             rating:
 *               type: number
 *             product:
 *               type: string
 *             user:
 *               type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid request or missing parameters
 *
 *   delete:
 *     tags:
 *       -  Reviews
 *     summary: Delete a review
 *     description: Deletes a review based on the given ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       400:
 *         description: Invalid request or missing parameters
 */
//!router.route('/').get(reviewController.getUserReviews);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    reviewController.setproductUserId,
    reviewController.createReview
  );
router.route('/:id').get(reviewController.getReview);

router.use(
  authController.protect,
  authController.restrictTo('user', 'admin', 'siteAdmin')
);
router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
module.exports = router;
