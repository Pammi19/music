require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Resonance API is running'
  });
});
app.listen(3000, () => {
  console.log('Resonance API running on http://localhost:3000');
});
