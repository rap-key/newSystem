// const { createProxyMiddleware } = require('http-proxy-middleware');
// module.exports = function (app) {
//     app.use(
//          '/api',
//         createProxyMiddleware({
//             target: '',
//             changOrigin: true,
//         })
//     );
// };

const { createProxyMiddleware } = require('http-proxy-middleware')
 
module.exports = function (app) {
 
  app.use(createProxyMiddleware('/api', {
 
    target: 'http://106.14.82.240:3000',
 
    secure: false,
 
    changeOrigin: true,
 
    pathRewrite: {
 
      "^/api": "/api"
 
    }
 
  }))
 
}