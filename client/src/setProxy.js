const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    proxy('/api/v1', {
      target: 'https://enigmatic-garden-06901.herokuapp.com/',
      changeOrigin: true
    })
  );
};
