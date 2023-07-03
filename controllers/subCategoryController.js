const Category = require('../models/categoryModel');
const SubCategory = require('../models/subCategoryModel');
const Factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

//get all of the sub-category
exports.getAllSubCategories = Factory.getAll(SubCategory);
//get a sub-category
exports.getSubCategory = Factory.getOne(SubCategory);

//create a new sub-category
exports.createSubCategory = catchAsync(async (req, res, next) => {
  const doc = req.body;
  const category = await Category.findById(doc.category);
  if (!category) {
    return next(new AppError(404, `${Category.modelName} not found`));
  }
  const subcategory = new SubCategory({
    name: doc.name,
    category: doc.category,
  });
  const newSubcategory = await subcategory.save();
  category.subcategories.push(newSubcategory._id);
  await category.save();
  res.status(200).json({
    status: 'success',
    doc,
  });
});
//exports.createSubCategory = Factory.createOne(SubCategory);

//update a sub-category
exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const doc = req.body;
  const subcategory = await SubCategory.findByIdAndUpdate(
    req.params.subcategoryId,
    { doc },
    { new: true }
  );
  if (!subcategory) {
    return next(new AppError(404, `${SubCategory.modelName} not found`));
  }
  res.status(200).json({
    status: 'success',
    doc,
  });
});
//delete a sub-category
exports.deleteSubCategory = Factory.deleteOne(SubCategory);
