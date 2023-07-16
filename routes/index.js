const express = require('express');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const categoryRouter = require('./categoryRoutes');
const subCategoryRouter = require('./subCategoryRoutes');
const reviewRouter = require('./reviewRoutes');
const swaggerCategory = require('../utils/swaggerCategory');

const routes = express.Router();

/* GET home page. */
routes.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

routes.use('/users', userRouter);
routes.use('/products', productRouter);
routes.use('/categories', categoryRouter);
routes.use('/subcategories', subCategoryRouter);
routes.use('/reviews', reviewRouter);

// Assign categories to their respective routers
swaggerCategory.forEach((category) => {
  switch (category.name) {
    case 'User Management':
      routes.use(category.route, userRouter);
      break;
    case 'Product Catalog':
      routes.use(category.route, productRouter);
      break;
    case 'Categories':
      routes.use(category.route, categoryRouter);
      break;
    case 'Subcategories':
      routes.use(category.route, subCategoryRouter);
      break;
    case 'Reviews':
      routes.use(category.route, reviewRouter);
      break;
    // Add more cases for additional categories
    default:
      break;
  }
});

module.exports = routes;
