const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const Uploader = require('../controllers/uploadController');
//!const uploader = require('../utils/uploader');

const router = express.Router();

//authorization routes:
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: List of All APIS on Users Route
 * /users:
 *   get:
 *     tags:
 *       -  Users
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
 *     tags:
 *       -  Users
 *     summary: Create a user
 *     description: Create a new user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object containing registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             userName:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             confPassword:
 *               type: string
 *               format: password
 *             email:
 *               type: string
 *               format: email
 *             phoneNumber:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 * /users/{id}:
 *   get:
 *     tags:
 *       -  Users
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
 *     tags:
 *       -  Users
 *     summary: Update a user
 *     description: Update a user based on their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: false
 *         description: ID of the user
 *         schema:
 *           type: string
 *       - in: formData
 *         name: firstName
 *         description: First name of the user
 *         required: false
 *         type: string
 *       - in: formData
 *         name: lastName
 *         description: Last name of the user
 *         required: false
 *         type: string
 *       - in: formData
 *         name: userName
 *         description: User name of the user
 *         required: false
 *         type: string
 *       - in: formData
 *         name: photo
 *         description: Image of the user
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/userModel'
 *
 *   delete:
 *     tags:
 *       -  Users
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
 * /users/forgotPassword:
 *   post:
 *     tags:
 *       -  Users
 *     summary: user forgot password
 *     description: sending reset password token to user email
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object containing registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 * /users/resetPassword:
 *   patch:
 *     tags:
 *       -  Users
 *     summary: user reset password
 *     description: change password via reset link
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object containing registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *               format: password
 *             confPassword:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 * /users/signUp:
 *   post:
 *     tags:
 *       -  Users
 *     summary: Register a new user
 *     description: Registers a new user with the provided details.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: user
 *         description: User object containing registration details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             userName:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *             confPassword:
 *               type: string
 *               format: password
 *             email:
 *               type: string
 *               format: email
 *             phoneNumber:
 *               type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 */
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//signup route

router.post('/signUp', authController.signUp);
//login route
/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: List of All APIS on Users Route
 * /users/login:
 *   post:
 *     tags:
 *       -  Users
 *     summary: User Login
 *     description: Logs in a user with the provided userName and password.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: loginCredentials
 *         description: Login credentials of the user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userName:
 *               type: string
 *             password:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 *       401:
 *         description: Unauthorized - Invalid userName or password
 * /users/logout:
 *   post:
 *     tags:
 *       -  Users
 *     summary: User logout
 *     description: Logs out the user by one click
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 *       401:
 *         description: Unauthorized - Invalid userName or password
 * /users/changePassword:
 *   patch:
 *     tags:
 *       -  Users
 *     summary: User change password
 *     description: user change the password using old pass and get new password.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: loginCredentials
 *         description: Login credentials of the user
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             currentPassword:
 *               type: string
 *               format: password
 *             newPassword:
 *               type: string
 *               format: password
 *             newConfPassword:
 *               type: string
 *               format: password
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 *       401:
 *         description: Unauthorized - Invalid userName or password
 * /users/profile:
 *   get:
 *     tags:
 *       -  Users
 *     summary: Get user profile
 *     description: goes to user profile details
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 * /users/deleteAccount:
 *   patch:
 *     tags:
 *       -  Users
 *     summary: User delete account
 *     description: user delete the account(only make his active field to false).
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: loginCredentials
 *         description: Login credentials of the user
 *         required: true
 *         schema:
 *           type: object
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/models/userModel'
 *       400:
 *         description: Invalid request or missing parameters
 *       401:
 *         description: Unauthorized - Invalid userName or password
 * /users/changeInfo:
 *   patch:
 *     tags:
 *       -  Users
 *     summary: User change account info
 *     description: user change the account informations(except unchangable fields and password).
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: firstName
 *         description: First name of the user
 *         required: false
 *         type: string
 *       - in: formData
 *         name: lastName
 *         description: Last name of the user
 *         required: false
 *         type: string
 *       - in: formData
 *         name: phoneNumber
 *         description: Phone number of the user
 *         required: false
 *         type: string
 *       - in: formData
 *         name: coverImage
 *         description: Profile photo of the user
 *         required: false
 *         type: file
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid request or missing parameters
 */

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
router.patch(
  '/changeInfo',
  Uploader.uploadSinglePhoto,
  Uploader.resizeSinglePhoto,
  userController.updateMe
);

//restrict routes only for Admin
router.use(authController.restrictTo('admin'));
router.route('/deleteAllUsers').delete(authController.deleteAllUsers);
//changing user Role by Admin
router.patch('/changeRole/:id', authController.changeRole);

//get list of all users
//! dont forget to restrict to super admin user
/**
 * @swagger
 * tags:
 *   - name: Users
 *
 * /users/deleteAllUsers:
 *   delete:
 *     tags:
 *       -  Users
 *     summary: Delete all  users except users with the role of Admin
 *     description: Delete a user based on their ID
 *
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './models/userModel'
 *
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
