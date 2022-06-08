const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URL
module.exports = () => {
  
  //coneecting mongodb
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Mongodb connected....');
    })
    .catch(err => console.log(err.message));


  // mongodb event when it is connnected
  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to db...');
  });

  //mongodb event on some error
  mongoose.connection.on('error', err => {
    console.log(err.message);
  });

  // mongodb event when it is disconnnected
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection is disconnected...');
  });

  //mongodb event on closing the connection
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(
        'Mongoose connection is disconnected due to app termination...'
      );
      process.exit(0);
    });
  });
};