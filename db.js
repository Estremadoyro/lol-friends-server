const mongoose = require('mongoose');
const { DB_URI } = require('./keys').MONGO_CREDENTIALS;


module.exports = () => {
  mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, () => {
    console.log('DB Connected');
  });
}
