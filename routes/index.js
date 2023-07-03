const express = require('express');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const categorRouter = require('./categoryRoutes');
const subCategorRouter = require('./subCategoryRoutes');

const routes = express.Router();

/* GET home page. */
// routes.get('/', (req, res, next) => {
//   res.render('index', { title: 'Express' });
// });

routes.use('/users', userRouter);
routes.use('/products', productRouter);
routes.use('/categories', categorRouter);
routes.use('/subcategories', subCategorRouter);

module.exports = routes;
