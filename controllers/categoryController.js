const Category = require('../models/categoryModel');
const Factory = require('./handlerFactory');
//const AppError = require('../utils/appError');
//const catchAsync = require('../utils/catchAsync');

//CRUD Methods
exports.getAllCategory = Factory.getAll(Category);
exports.getCategory = Factory.getOne(Category);
exports.createCategory = Factory.createOne(Category);
exports.updateCategory = Factory.updateOne(Category);
exports.deleteCategory = Factory.deleteOne(Category);
