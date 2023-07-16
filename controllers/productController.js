/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const Product = require('../models/productModel');
const Factory = require('./handlerFactory');
//const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

//CRUD Operations for Product

exports.getAllProducts = Factory.getAll(Product);
exports.getProduct = Factory.getOne(
  Product,
  ['reviews'],
  ['review', 'rating', 'user']
);
exports.createProduct = Factory.createOne(Product);
exports.updateProduct = Factory.updateOne(Product);
exports.deleteProduct = Factory.deleteOne(Product);
