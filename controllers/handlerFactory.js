const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// exports.getAll = (Model) =>
//   catchAsync(async (req, res, next) => {
//     // For nested routes
//     let filter = {};
//     if (req.params.postId) {
//       filter = { tour: req.params.postId };
//     }

//     const features = new APIFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .paginate()
//       .search();

//     const doc = await features.query;

//     res.status(200).json({
//       status: 'success',
//       results: doc.length,
//       data: { doc },
//     });
//   });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //!for nested routes CHECK
    let filter = {};
    if (req.params.userId) filter = { userId: req.params.userId };
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      doc,
    });
  });

exports.getOne = (Model, populateOptions, selectOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (populateOptions) {
      // Check if populateOptions is provided
      if (Array.isArray(populateOptions)) {
        // If populateOptions is an array, populate each option
        populateOptions.forEach((option) => {
          query = query.populate({
            path: option,
            select: selectOptions, // Use the selectOptions parameter
          });
        });
      } else {
        // If populateOptions is a single option, populate it
        query = query.populate({
          path: populateOptions,
          select: selectOptions, // Use the selectOptions parameter
        });
      }
    }

    const doc = await query.exec();

    // const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError(404, `${Model.modelName} not found`));
    }
    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(new AppError(404, `${Model.modelName} not found`));
    }
    res.status(200).json({
      status: 'success',
      doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError(404, `${Model.modelName} not found`));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
