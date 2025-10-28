const config = {
  // Database configuration
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/get2it_db',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },

  // Server configuration
  server: {
    port: process.env.PORT || 5000
  },

  // JWT configuration (for future authentication tokens)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '1h'
  }
};

module.exports = config;