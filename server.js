const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json({ extended: false }));

app.use(cors());

//Connect DB

const connectDB = require('./config/db');

connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/auth', require('./api/routes/auth'));
app.use('/api/posts', require('./api/routes/posts'));
app.use('/api/profile', require('./api/routes/profile'));
app.use('/api/users', require('./api/routes/users'));

app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});
