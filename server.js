const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

if (
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  // Heroku build paths setup
  app.use(express.static(path.join(__dirname, './client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
