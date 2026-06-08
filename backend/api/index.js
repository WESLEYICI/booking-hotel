const app = require('../app');

// Vercel Serverless Function membutuhkan export dari aplikasi Express (tanpa app.listen)
module.exports = app;
