const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const port = process.env.PORT || 5000;

app.use(
  proxy('/api/v1', {
    target: 'https://enigmatic-garden-06901.herokuapp.com',
    changeOrigin: true
  })
);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
