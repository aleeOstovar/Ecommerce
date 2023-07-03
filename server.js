const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log('errname: ', err.name, 'errMsg: ', err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const option = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(DB, option).then(() => {
  console.log('DB connected');
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`kiss me like you miss me Port: ${port}`);
});
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
