/* eslint-disable node/no-unpublished-require */
/* eslint-disable import/no-extraneous-dependencies */
const slugify = require('slugify');
const farsiSlug = require('../utils/farsiSlug');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
    let query;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // If the parameter is a valid MongoDB ID, search by ID
      query = Model.findById(req.params.id);
    } else {
      // If the parameter is not a valid MongoDB ID, search by slug
      query = Model.findOne({
        $or: [{ 'slug.en': req.params.id }, { 'slug.fa': req.params.id }],
      });
    }

    if (populateOptions) {
      // Check if populateOptions is provided
      if (Array.isArray(populateOptions)) {
        // If populateOptions is an array, populate each option
        query = query.populate(
          populateOptions.map((option) => ({
            path: option,
            select: `${selectOptions.join(' ')}`,
          }))
        );
      } else {
        // If populateOptions is a single option, populate it
        query = query.populate({
          path: populateOptions,
          select: `${selectOptions.join(' ')}`,
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
    if (req.body['title.fa']) {
      req.body['slug.fa'] = farsiSlug(req.body['title.fa']);
    }
    if (req.body['title.en']) {
      req.body['slug.en'] = slugify(req.body['title.en'], { lower: true });
    }
    let query;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // If the parameter is a valid MongoDB ID, search by ID
      query = Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
    } else {
      // If the parameter is not a valid MongoDB ID, search by slug
      query = Model.findOneAndUpdate(
        { $or: [{ 'slug.en': req.params.id }, { 'slug.fa': req.params.id }] },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
    }
    // Execute the query
    const doc = await query;
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
    let query;

    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      // If the parameter is a valid MongoDB ID, search by ID
      query = Model.findByIdAndDelete(req.params.id);
    } else {
      // If the parameter is not a valid MongoDB ID, search by slug
      query = Model.findOneAndDelete({
        $or: [{ 'slug.en': req.params.id }, { 'slug.fa': req.params.id }],
      });
    }
    // Execute the query
    const doc = await query;

    if (!doc) {
      return next(new AppError(404, `${Model.modelName} not found`));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.deleteAll = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany({});

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
