// const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const Factory = require('./handlerFactory');
// const AppError = require('../utils/appError');
// const catchAsync = require('../utils/catchAsync');

//get all of the sub-category
exports.getAllSubCategories = Factory.getAll(SubCategory);
//get a sub-category
exports.getSubCategory = Factory.getOne(
  SubCategory,
  ['products'],
  ['title.fa', 'title.en', 'images']
);

//create a new sub-category
exports.createSubCategory = Factory.createOne(SubCategory);

//update a sub-category
exports.updateSubCategory = Factory.updateOne(SubCategory);
//delete a sub-category
exports.deleteSubCategory = Factory.deleteOne(SubCategory);
//delete all sub-categories
exports.deleteAllSubCategories = Factory.deleteAll(SubCategory);

exports.uploadSubCategoryImage = (req, res, next) => {
  if (req.file) {
    req.body.coverImage = req.file.filename;
  }
  next();
};
