const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const Uploader = require('../controllers/uploadController');
//!const uploader = require('../utils/uploader');

const router = express.Router();

//authorization routes:
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//signup route
router.post('/signUp', authController.signUp);
//login route
router.post('/login', authController.logIn);

router.use(authController.protect);
//logout route
router.post('/logout', authController.logout);
// changing password by user
router.patch('/changePassword', authController.changePassword);

// user profile api
router.get('/profile', userController.getMe, userController.getUser);

//delete account by user:
router.patch('/deleteAccount', userController.deleteMe);
//user change info api
//! after implementing uploader handler, add  uploaderSinglePhoto and resizeSinglePhoto
router.patch(
  '/changeInfo',
  Uploader.uploadSinglePhoto,
  Uploader.resizeSinglePhoto,
  userController.updateMe
);

//restrict routes only for Admin
router.use(authController.restrictTo('admin'));

//changing user Role by Admin
router.patch('/changeRole/:id', authController.changeRole);

//get list of all users
//! dont forget to restrict to super admin user
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *   post:
 *     summary: Create a user
 *     description: Create a new user
 *     "parameters": [
 *        {
 *           "name": "user",
 *           "in": "body",
 *           "schema": {
 *             "$ref": '#/models/userModel'
 *           }
 *         }
 *       ]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 * /users/{id}:
 *   get:
 *     summary: Get a user
 *     description: Returns a user based on their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/userModel'
 *   patch:
 *     summary: Update a user
 *     description: Update a user based on their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/userModel'
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user based on their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/userModel'
 */

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// get/update/delete a user
//! dont forget to restrict to super admin user
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
